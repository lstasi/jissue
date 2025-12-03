import * as vscode from 'vscode';

/**
 * Manages authentication with Jira using VS Code's SecretStorage API
 */
export class JiraAuthManager {
    private static readonly TOKEN_KEY = 'jissue.jiraApiToken';
    private readonly secretStorage: vscode.SecretStorage;
    private readonly context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.secretStorage = context.secrets;
    }

    /**
     * Store the Jira API token securely
     */
    async storeToken(token: string): Promise<void> {
        await this.secretStorage.store(JiraAuthManager.TOKEN_KEY, token);
    }

    /**
     * Retrieve the stored Jira API token
     */
    async getToken(): Promise<string | undefined> {
        return await this.secretStorage.get(JiraAuthManager.TOKEN_KEY);
    }

    /**
     * Delete the stored Jira API token
     */
    async clearToken(): Promise<void> {
        await this.secretStorage.delete(JiraAuthManager.TOKEN_KEY);
    }

    /**
     * Check if a token is stored
     */
    async hasToken(): Promise<boolean> {
        const token = await this.getToken();
        return token !== undefined && token.length > 0;
    }

    /**
     * Get Jira configuration from VS Code settings
     */
    getJiraConfig(): { jiraUrl: string; username: string } | undefined {
        const config = vscode.workspace.getConfiguration('jissue');
        const jiraUrl = config.get<string>('jiraUrl');
        const username = config.get<string>('jiraUsername');

        if (!jiraUrl || !username) {
            return undefined;
        }

        return { jiraUrl, username };
    }

    /**
     * Prompt user to enter their Jira API token
     */
    async promptForToken(): Promise<string | undefined> {
        const token = await vscode.window.showInputBox({
            prompt: 'Enter your Jira API token',
            password: true,
            ignoreFocusOut: true,
            placeHolder: 'Your Jira API token',
            validateInput: (value: string) => {
                if (!value || value.trim().length === 0) {
                    return 'Token cannot be empty';
                }
                return null;
            }
        });

        if (token) {
            await this.storeToken(token);
        }

        return token;
    }

    /**
     * Validate Jira connection with provided credentials
     */
    async validateConnection(): Promise<{ success: boolean; message: string }> {
        const config = this.getJiraConfig();
        if (!config) {
            return {
                success: false,
                message: 'Please configure jiraUrl and jiraUsername in settings'
            };
        }

        const token = await this.getToken();
        if (!token) {
            return {
                success: false,
                message: 'No API token found. Please set your Jira API token.'
            };
        }

        try {
            // Create basic auth header
            const auth = Buffer.from(`${config.username}:${token}`).toString('base64');
            
            // Test connection by fetching user info
            const response = await fetch(`${config.jiraUrl}/rest/api/3/myself`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Successfully connected to Jira'
                };
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    message: `Failed to connect to Jira: ${response.status} ${response.statusText}. ${errorText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error connecting to Jira: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    /**
     * Get authentication headers for Jira API requests
     */
    async getAuthHeaders(): Promise<{ [key: string]: string } | undefined> {
        const config = this.getJiraConfig();
        if (!config) {
            return undefined;
        }

        const token = await this.getToken();
        if (!token) {
            return undefined;
        }

        const auth = Buffer.from(`${config.username}:${token}`).toString('base64');
        return {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
}
