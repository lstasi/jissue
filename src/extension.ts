import * as vscode from 'vscode';

/**
 * This method is called when the extension is activated.
 * The extension is activated the very first time the command is executed.
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('Jissue extension is now active');

    // Register the hello world command
    const helloCommand = vscode.commands.registerCommand('jissue.helloWorld', () => {
        vscode.window.showInformationMessage('Hello from Jissue!');
    });

    context.subscriptions.push(helloCommand);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate(): void {
    // Clean up resources if needed
}
