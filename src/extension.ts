import * as vscode from 'vscode';
import { JiraAuthManager } from './auth';
import { JiraIssueTreeDataProvider } from './issueTree';

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

    context.subscriptions.push(
        treeView,
        helloCommand,
        setTokenCommand,
        clearTokenCommand,
        validateConnectionCommand,
        refreshIssuesCommand
    );
}

/**
 * This method is called when the extension is deactivated.
 * Dispose of disposables, timers, or other resources here if needed.
 */
export function deactivate(): void {
    // No cleanup needed currently
}
