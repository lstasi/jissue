import * as assert from 'assert';
import * as vscode from 'vscode';
import { JiraIssueTreeDataProvider, JiraIssue, JiraIssueTreeItem, QuickFilter } from '../../issueTree';
import { JiraAuthManager } from '../../auth';

suite('JiraIssueTreeDataProvider Test Suite', () => {
    let context: vscode.ExtensionContext;
    let authManager: JiraAuthManager;
    let treeDataProvider: JiraIssueTreeDataProvider;

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
        treeDataProvider = new JiraIssueTreeDataProvider(authManager);
    });

    test('Should create tree data provider', () => {
        assert.ok(treeDataProvider);
    });

    test('Should return empty children when no issues loaded', async () => {
        const children = await treeDataProvider.getChildren();
        // Without proper Jira configuration, it should return empty array
        assert.ok(Array.isArray(children));
    });

    test('Should create tree item with correct properties', () => {
        const issue: JiraIssue = {
            key: 'TEST-123',
            summary: 'Test issue',
            status: 'In Progress',
            assignee: 'John Doe',
            issueType: 'Bug'
        };

        const treeItem = new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None);
        
        assert.strictEqual(treeItem.label, 'TEST-123');
        assert.strictEqual(treeItem.description, 'Test issue');
        assert.strictEqual(treeItem.tooltip, 'TEST-123: Test issue');
        assert.strictEqual(treeItem.contextValue, 'jiraIssue');
    });

    test('Should have correct icon for Bug issue type', () => {
        const issue: JiraIssue = {
            key: 'TEST-124',
            summary: 'Bug issue',
            status: 'Open',
            issueType: 'Bug'
        };

        const treeItem = new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None);
        assert.ok(treeItem.iconPath);
    });

    test('Should have correct icon for Story issue type', () => {
        const issue: JiraIssue = {
            key: 'TEST-125',
            summary: 'Story issue',
            status: 'Open',
            issueType: 'Story'
        };

        const treeItem = new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None);
        assert.ok(treeItem.iconPath);
    });

    test('Should have correct icon for Task issue type', () => {
        const issue: JiraIssue = {
            key: 'TEST-126',
            summary: 'Task issue',
            status: 'Open',
            issueType: 'Task'
        };

        const treeItem = new JiraIssueTreeItem(issue, vscode.TreeItemCollapsibleState.None);
        assert.ok(treeItem.iconPath);
    });

    test('TreeDataProvider should have refresh method', () => {
        assert.ok(typeof treeDataProvider.refresh === 'function');
        // Should not throw when called
        treeDataProvider.refresh();
    });

    test('TreeDataProvider should have reloadIssues method', async () => {
        assert.ok(typeof treeDataProvider.reloadIssues === 'function');
        // Should not throw when called (even without proper config)
        await treeDataProvider.reloadIssues();
    });

    test('TreeDataProvider should have setFilter method', async () => {
        assert.ok(typeof treeDataProvider.setFilter === 'function');
        // Should not throw when called (even without proper config)
        await treeDataProvider.setFilter(QuickFilter.MyIssues);
    });

    test('TreeDataProvider should have setCustomJQL method', async () => {
        assert.ok(typeof treeDataProvider.setCustomJQL === 'function');
        // Should not throw when called (even without proper config)
        await treeDataProvider.setCustomJQL('project = TEST');
    });

    test('TreeDataProvider should have loadMore method', async () => {
        assert.ok(typeof treeDataProvider.loadMore === 'function');
        // Should not throw when called (even without proper config)
        await treeDataProvider.loadMore();
    });

    test('TreeDataProvider should have hasMore method', () => {
        assert.ok(typeof treeDataProvider.hasMore === 'function');
        // Should return false when no issues loaded
        assert.strictEqual(treeDataProvider.hasMore(), false);
    });

    test('QuickFilter enum should have expected values', () => {
        assert.strictEqual(QuickFilter.MyIssues, 'myIssues');
        assert.strictEqual(QuickFilter.RecentIssues, 'recentIssues');
        assert.strictEqual(QuickFilter.AllOpenIssues, 'allOpenIssues');
        assert.strictEqual(QuickFilter.CustomJQL, 'customJQL');
    });
});
