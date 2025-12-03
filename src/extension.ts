import * as vscode from 'vscode';
import { JiraAuthManager } from './auth';
import { JiraIssueTreeDataProvider, QuickFilter } from './issueTree';

/**
 * This method is called when the extension is activated.
 * The extension is activated the very first time the command is executed.
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('Jissue extension is now active');

    // Initialize auth manager
    const authManager = new JiraAuthManager(context);

    // Initialize tree view
    const issueTreeDataProvider = new JiraIssueTreeDataProvider(authManager);
    const treeView = vscode.window.createTreeView('jissueIssues', {
        treeDataProvider: issueTreeDataProvider
    });

    // Register the hello world command
    const helloCommand = vscode.commands.registerCommand('jissue.helloWorld', () => {
        vscode.window.showInformationMessage('Hello from Jissue!');
    });

    // Register command to set Jira API token
    const setTokenCommand = vscode.commands.registerCommand('jissue.setToken', async () => {
        const token = await authManager.promptForToken();
        if (token) {
            vscode.window.showInformationMessage('Jira API token stored securely');
        }
    });

    // Register command to clear Jira API token
    const clearTokenCommand = vscode.commands.registerCommand('jissue.clearToken', async () => {
        await authManager.clearToken();
        vscode.window.showInformationMessage('Jira API token cleared');
    });

    // Register command to validate Jira connection
    const validateConnectionCommand = vscode.commands.registerCommand('jissue.validateConnection', async () => {
        const result = await authManager.validateConnection();
        if (result.success) {
            vscode.window.showInformationMessage(result.message);
        } else {
            vscode.window.showErrorMessage(result.message);
        }
    });

    // Register command to refresh issues
    const refreshIssuesCommand = vscode.commands.registerCommand('jissue.refreshIssues', async () => {
        await issueTreeDataProvider.reloadIssues();
    });

    // Register command to set custom JQL query
    const setCustomJQLCommand = vscode.commands.registerCommand('jissue.setCustomJQL', async () => {
        const jql = await vscode.window.showInputBox({
            prompt: 'Enter custom JQL query',
            placeHolder: 'e.g., project = MYPROJECT AND status = "In Progress"',
            ignoreFocusOut: true,
            validateInput: (value: string) => {
                if (!value || value.trim().length === 0) {
                    return 'JQL query cannot be empty';
                }
                return null;
            }
        });

        if (jql) {
            await issueTreeDataProvider.setCustomJQL(jql);
            vscode.window.showInformationMessage('Custom JQL query applied');
        }
    });

    // Register command to filter by "My Issues"
    const filterMyIssuesCommand = vscode.commands.registerCommand('jissue.filterMyIssues', async () => {
        await issueTreeDataProvider.setFilter(QuickFilter.MyIssues);
        vscode.window.showInformationMessage('Showing your open issues');
    });

    // Register command to filter by "Recent Issues"
    const filterRecentIssuesCommand = vscode.commands.registerCommand('jissue.filterRecentIssues', async () => {
        await issueTreeDataProvider.setFilter(QuickFilter.RecentIssues);
        vscode.window.showInformationMessage('Showing recent issues');
    });

    // Register command to filter by "All Open Issues"
    const filterAllOpenIssuesCommand = vscode.commands.registerCommand('jissue.filterAllOpenIssues', async () => {
        await issueTreeDataProvider.setFilter(QuickFilter.AllOpenIssues);
        vscode.window.showInformationMessage('Showing all open issues');
    });

    // Register command to load more issues
    const loadMoreIssuesCommand = vscode.commands.registerCommand('jissue.loadMoreIssues', async () => {
        if (issueTreeDataProvider.hasMore()) {
            await issueTreeDataProvider.loadMore();
        } else {
            vscode.window.showInformationMessage('All issues loaded');
        }
    });

    context.subscriptions.push(
        treeView,
        helloCommand,
        setTokenCommand,
        clearTokenCommand,
        validateConnectionCommand,
        refreshIssuesCommand,
        setCustomJQLCommand,
        filterMyIssuesCommand,
        filterRecentIssuesCommand,
        filterAllOpenIssuesCommand,
        loadMoreIssuesCommand
    );
}

/**
 * This method is called when the extension is deactivated.
 * Dispose of disposables, timers, or other resources here if needed.
 */
export function deactivate(): void {
    // No cleanup needed currently
}
