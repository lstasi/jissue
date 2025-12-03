import * as vscode from 'vscode';
import { JiraAuthManager } from './auth';

/**
 * Represents a Jira issue in the tree
 */
export interface JiraIssue {
    key: string;
    summary: string;
    status: string;
    assignee?: string;
    issueType: string;
}

/**
 * Jira API response types
 */
interface JiraApiIssue {
    key: string;
    fields: {
        summary: string;
        status: {
            name: string;
        };
        assignee?: {
            displayName: string;
        };
        issuetype: {
            name: string;
        };
    };
}

interface JiraApiResponse {
    issues: JiraApiIssue[];
    startAt: number;
    maxResults: number;
    total: number;
}

/**
 * Quick filter options for issue listing
 */
export enum QuickFilter {
    MyIssues = 'myIssues',
    RecentIssues = 'recentIssues',
    AllOpenIssues = 'allOpenIssues',
    CustomJQL = 'customJQL'
}

/**
 * Tree item representing a Jira issue
 */
export class JiraIssueTreeItem extends vscode.TreeItem {
    constructor(
        public readonly issue: JiraIssue,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(issue.key, collapsibleState);
        this.tooltip = `${issue.key}: ${issue.summary}`;
        this.description = issue.summary;
        this.contextValue = 'jiraIssue';
        
        // Set icon based on issue type
        this.iconPath = new vscode.ThemeIcon(this.getIconForIssueType(issue.issueType));
    }

    private getIconForIssueType(issueType: string): string {
        const type = issueType.toLowerCase();
        if (type.includes('bug')) {
            return 'bug';
        } else if (type.includes('story')) {
            return 'book';
        } else if (type.includes('task')) {
            return 'checklist';
        } else if (type.includes('epic')) {
            return 'milestone';
        }
        return 'circle-outline';
    }
}

/**
 * Data provider for the Jira issues tree view
 */
export class JiraIssueTreeDataProvider implements vscode.TreeDataProvider<JiraIssueTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<JiraIssueTreeItem | undefined | null | void> = new vscode.EventEmitter<JiraIssueTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<JiraIssueTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private issues: JiraIssue[] = [];
    private isLoading = false;
    private currentFilter: QuickFilter = QuickFilter.MyIssues;
    private customJQL: string = '';
    private startAt: number = 0;
    private totalResults: number = 0;

    constructor(private authManager: JiraAuthManager) {}

    /**
     * Refresh the tree view
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Get tree item for display
     */
    getTreeItem(element: JiraIssueTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Get children for the tree
     */
    async getChildren(element?: JiraIssueTreeItem): Promise<JiraIssueTreeItem[]> {
        if (element) {
            // No children for individual issues in this basic implementation
            return [];
        }

        // Load issues on first access
        if (this.issues.length === 0 && !this.isLoading) {
            await this.loadIssues();
        }

        return this.issues.map(issue => 
            new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None)
        );
    }

    /**
     * Get JQL query based on current filter
     */
    private getJQLForFilter(): string {
        switch (this.currentFilter) {
            case QuickFilter.MyIssues:
                return 'assignee = currentUser() AND status != Done ORDER BY updated DESC';
            case QuickFilter.RecentIssues:
                return 'assignee = currentUser() ORDER BY updated DESC';
            case QuickFilter.AllOpenIssues:
                return 'status != Done ORDER BY updated DESC';
            case QuickFilter.CustomJQL:
                return this.customJQL || this.getDefaultJQL();
            default:
                return this.getDefaultJQL();
        }
    }

    /**
     * Get default JQL from configuration
     */
    private getDefaultJQL(): string {
        const config = vscode.workspace.getConfiguration('jissue');
        return config.get<string>('defaultJQL') || 'assignee = currentUser() AND status != Done ORDER BY updated DESC';
    }

    /**
     * Get max results from configuration
     */
    private getMaxResults(): number {
        const config = vscode.workspace.getConfiguration('jissue');
        return config.get<number>('maxResults') || 50;
    }

    /**
     * Load issues from Jira
     */
    private async loadIssues(append: boolean = false): Promise<void> {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        try {
            const config = this.authManager.getJiraConfig();
            if (!config) {
                vscode.window.showWarningMessage('Please configure Jira URL and username in settings');
                return;
            }

            const headers = await this.authManager.getAuthHeaders();
            if (!headers) {
                vscode.window.showWarningMessage('Please set your Jira API token');
                return;
            }

            const jql = this.getJQLForFilter();
            const maxResults = this.getMaxResults();
            const startAt = append ? this.startAt : 0;
            
            const url = `${config.jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}`;

            // Create an AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch issues: ${response.status} ${response.statusText}`);
                }

                const data = await response.json() as JiraApiResponse;
                const newIssues = data.issues.map((issue: JiraApiIssue) => ({
                    key: issue.key,
                    summary: issue.fields.summary,
                    status: issue.fields.status.name,
                    assignee: issue.fields.assignee?.displayName,
                    issueType: issue.fields.issuetype.name
                }));

                if (append) {
                    this.issues = [...this.issues, ...newIssues];
                } else {
                    this.issues = newIssues;
                }

                this.startAt = data.startAt + data.issues.length;
                this.totalResults = data.total;

            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                    throw new Error('Request timed out after 30 seconds');
                }
                throw fetchError;
            }

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load Jira issues: ${error instanceof Error ? error.message : String(error)}`);
            if (!append) {
                this.issues = [];
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Manually load issues (called by refresh command)
     */
    async reloadIssues(): Promise<void> {
        this.issues = [];
        this.startAt = 0;
        await this.loadIssues();
        this.refresh();
    }

    /**
     * Set a quick filter and reload issues
     */
    async setFilter(filter: QuickFilter): Promise<void> {
        this.currentFilter = filter;
        await this.reloadIssues();
    }

    /**
     * Set custom JQL query and reload issues
     */
    async setCustomJQL(jql: string): Promise<void> {
        this.customJQL = jql;
        this.currentFilter = QuickFilter.CustomJQL;
        await this.reloadIssues();
    }

    /**
     * Load more issues (pagination)
     */
    async loadMore(): Promise<void> {
        if (this.hasMore()) {
            await this.loadIssues(true);
            this.refresh();
            vscode.window.showInformationMessage(`Loaded ${this.issues.length} of ${this.totalResults} issues`);
        } else {
            vscode.window.showInformationMessage('All issues loaded');
        }
    }

    /**
     * Check if more issues can be loaded
     */
    hasMore(): boolean {
        return this.startAt < this.totalResults;
    }
}
