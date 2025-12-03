# Jissue

[![CI](https://github.com/lstasi/Jissue/actions/workflows/ci.yml/badge.svg)](https://github.com/lstasi/Jissue/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)

A Visual Studio Code extension to view and manage Jira issues directly from your editor.

## Features

- **Token-based Authentication**: Securely connect to your Jira instance using API tokens
- **Issue Listing**: View issues with custom JQL queries
- **Branch Management**: Select an issue, create a Git branch, and set the issue status to "In Progress"
- **AI Agent Integration**: Generate Markdown files with issue descriptions for use with AI coding agents

## Prerequisites

- Visual Studio Code 1.85.0 or higher
- A Jira account with API token access
- Git installed and configured

## Installation

> **Note**: This extension is currently in development. Installation instructions will be updated once the extension is published to the VS Code Marketplace.

### From Source (Development)

1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to launch the Extension Development Host

## Configuration

Configure the extension in your VS Code settings:

```json
{
  "jissue.jiraUrl": "https://your-domain.atlassian.net",
  "jissue.jiraUsername": "your-email@example.com",
  "jissue.defaultJQL": "assignee = currentUser() AND status != Done ORDER BY updated DESC",
  "jissue.maxResults": 50
}
```

### Configuration Options

- **jissue.jiraUrl**: Your Jira instance URL (e.g., `https://your-domain.atlassian.net`)
- **jissue.jiraUsername**: Your Jira username or email address
- **jissue.defaultJQL**: Default JQL query for listing issues (default: `assignee = currentUser() AND status != Done ORDER BY updated DESC`)
- **jissue.maxResults**: Maximum number of issues to fetch per request (1-100, default: 50)

### Getting a Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give your token a label and copy the generated token
4. When prompted by the extension, enter your API token (stored securely via VS Code's SecretStorage API)

## Usage

### Viewing Issues

1. Open the "Jira Issues" view in the Explorer sidebar
2. Issues will automatically load based on your default JQL query
3. Click the refresh icon to reload issues

### Quick Filters

Access quick filters via the Command Palette (Ctrl/Cmd+Shift+P):

- **Jissue: Show My Issues** - Shows your assigned issues that are not done
- **Jissue: Show Recent Issues** - Shows all your recently updated issues
- **Jissue: Show All Open Issues** - Shows all open issues in your Jira instance

### Custom JQL Queries

1. Open Command Palette (Ctrl/Cmd+Shift+P)
2. Run **Jissue: Set Custom JQL Query**
3. Enter your custom JQL query (e.g., `project = MYPROJECT AND status = "In Progress"`)
4. Issues will reload with your custom query

### Pagination

When you have more issues than the configured `maxResults`:

1. Open Command Palette (Ctrl/Cmd+Shift+P)
2. Run **Jissue: Load More Issues**
3. Additional issues will be appended to the list

### Commands

- **Jissue: Set Jira API Token** - Store your Jira API token securely
- **Jissue: Clear Jira API Token** - Remove stored token
- **Jissue: Validate Jira Connection** - Test connection to Jira
- **Jissue: Refresh Issues** - Reload issue list
- **Jissue: Set Custom JQL Query** - Apply a custom JQL query
- **Jissue: Show My Issues** - Filter to show your open issues
- **Jissue: Show Recent Issues** - Filter to show recent issues
- **Jissue: Show All Open Issues** - Filter to show all open issues
- **Jissue: Load More Issues** - Load additional issues (pagination)

## Development

See [TODO.md](TODO.md) for the development roadmap and planned features.

### Project Setup

```bash
# Install dependencies
npm install

# Compile the extension
npm run compile

# Run tests
npm test

# Lint the code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## License

MIT License - see [LICENSE](LICENSE) for details.
