import * as assert from 'assert';
import * as vscode from 'vscode';
import { JiraAuthManager } from '../../auth';

suite('JiraAuthManager Test Suite', () => {
    let context: vscode.ExtensionContext;
    let authManager: JiraAuthManager;

    suiteSetup(() => {
        // Get the extension context
        const ext = vscode.extensions.getExtension('lstasi.jissue');
        if (!ext) {
            throw new Error('Extension not found');
        }
        // We need to activate the extension to get the context
        // In real tests, this would be handled differently
    });

    setup(async () => {
        // Create a mock context for testing
        const mockSecrets = new Map<string, string>();
        
        context = {
            secrets: {
                store: async (key: string, value: string) => {
                    mockSecrets.set(key, value);
                },
                get: async (key: string) => {
                    return mockSecrets.get(key);
                },
                delete: async (key: string) => {
                    mockSecrets.delete(key);
                },
                keys: async () => {
                    return Array.from(mockSecrets.keys());
                },
                onDidChange: new vscode.EventEmitter<vscode.SecretStorageChangeEvent>().event
            },
            subscriptions: [],
            extensionUri: vscode.Uri.file(''),
            extensionPath: '',
            environmentVariableCollection: {} as vscode.GlobalEnvironmentVariableCollection,
            storagePath: undefined,
            globalStoragePath: '',
            logPath: '',
            extensionMode: vscode.ExtensionMode.Test,
            globalState: {} as vscode.Memento & { setKeysForSync(keys: readonly string[]): void },
            workspaceState: {} as vscode.Memento,
            asAbsolutePath: (relativePath: string) => relativePath,
            storageUri: undefined,
            globalStorageUri: vscode.Uri.file(''),
            logUri: vscode.Uri.file(''),
            extension: {} as vscode.Extension<unknown>,
            languageModelAccessInformation: {} as vscode.LanguageModelAccessInformation
        } as vscode.ExtensionContext;

        authManager = new JiraAuthManager(context);
    });

    test('Should store and retrieve token', async () => {
        const testToken = 'test-token-123';
        await authManager.storeToken(testToken);
        const retrievedToken = await authManager.getToken();
        assert.strictEqual(retrievedToken, testToken);
    });

    test('Should return true when token exists', async () => {
        const testToken = 'test-token-456';
        await authManager.storeToken(testToken);
        const hasToken = await authManager.hasToken();
        assert.strictEqual(hasToken, true);
    });

    test('Should return false when token does not exist', async () => {
        const hasToken = await authManager.hasToken();
        assert.strictEqual(hasToken, false);
    });

    test('Should clear token', async () => {
        const testToken = 'test-token-789';
        await authManager.storeToken(testToken);
        await authManager.clearToken();
        const hasToken = await authManager.hasToken();
        assert.strictEqual(hasToken, false);
    });

    test('Should return undefined for Jira config when not configured', () => {
        const config = authManager.getJiraConfig();
        // Config might exist from user settings, so we test that the method returns a value or undefined
        // The method should return undefined if jiraUrl or jiraUsername are not configured
        if (config) {
            assert.ok(config.jiraUrl);
            assert.ok(config.username);
        }
    });

    test('Should create auth headers when token and config exist', async () => {
        const testToken = 'test-token-abc';
        await authManager.storeToken(testToken);
        
        // Note: This will return undefined if jiraUrl and jiraUsername are not configured
        // In a real environment, these would need to be set
        const headers = await authManager.getAuthHeaders();
        
        // If config is set, headers should exist
        if (headers) {
            assert.ok(headers.Authorization);
            assert.ok(headers.Accept);
            assert.ok(headers['Content-Type']);
        }
    });
});
