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

        // Load issues if not already loaded
        if (this.issues.length === 0) {
            await this.loadIssues();
        }

        return this.issues.map(issue => 
            new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None)
        );
    }

    /**
     * Load issues from Jira
     */
    private async loadIssues(): Promise<void> {
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

            // Default JQL query: issues assigned to current user that are not done
            const jql = 'assignee = currentUser() AND status != Done ORDER BY updated DESC';
            const url = `${config.jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50`;

            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch issues: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as JiraApiResponse;
            this.issues = data.issues.map((issue: JiraApiIssue) => ({
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status.name,
                assignee: issue.fields.assignee?.displayName,
                issueType: issue.fields.issuetype.name
            }));

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load Jira issues: ${error instanceof Error ? error.message : String(error)}`);
            this.issues = [];
        }
    }

    /**
     * Manually load issues (called by refresh command)
     */
    async reloadIssues(): Promise<void> {
        this.issues = [];
        await this.loadIssues();
        this.refresh();
    }
}
