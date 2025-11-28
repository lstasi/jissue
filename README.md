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
  "jissue.jiraToken": "your-api-token"
}
```

### Getting a Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give your token a label and copy the generated token
4. Use this token in the extension settings

## Usage

> **Note**: Usage instructions will be added as features are implemented.

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
4. Update CHANGELOG.md with your changes
5. Submit a pull request

All pull requests must update the CHANGELOG.md file with the changes made.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## License

MIT License - see [LICENSE](LICENSE) for details.
