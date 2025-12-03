# Changelog

All notable changes to the Jissue extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Phase 3: Issue Listing - Enhanced features
- JQL query execution with configurable default query via settings
- Custom JQL query support with input dialog
- Pagination support for large issue result sets
- Quick filter commands (My Issues, Recent Issues, All Open Issues)
- Configuration options: `jissue.defaultJQL` and `jissue.maxResults`
- "Load More Issues" command for pagination
- "Set Custom JQL Query" command for ad-hoc queries
- Quick filter commands for common issue views
- Extended tests for new filtering and pagination functionality
- Documentation for usage, configuration, and available commands
- Phase 3: Issue Listing - TreeView implementation
- JiraIssueTreeDataProvider for displaying Jira issues in VS Code
- TreeView in Explorer sidebar for browsing Jira issues
- Refresh command to reload issues from Jira
- Support for displaying issue key, summary, status, and type
- Icon indicators based on issue type (Bug, Story, Task, Epic)
- Default JQL query to show user's assigned issues that are not done
- Unit tests for TreeView functionality
- Phase 2: Authentication implementation
- Secure token storage using VS Code SecretStorage API
- JiraAuthManager class for managing authentication
- Commands for setting and clearing Jira API tokens
- Command for validating Jira connection
- Configuration UI for Jira credentials (jiraUrl and jiraUsername)
- Error handling for authentication failures
- Unit tests for authentication functionality
- Initial project setup
- README with project overview and features
- TODO roadmap for development phases
- CHANGELOG for version tracking
- GitHub Actions CI/CD workflow
- Dependabot configuration for dependency updates
- TypeScript configuration (`tsconfig.json`)
- ESLint configuration (`.eslintrc.json`)
- VS Code extension project structure with `src/` directory
- Main extension entry point (`src/extension.ts`)
- Test infrastructure with Mocha (`src/test/`)
- Hello World command for testing extension activation

## [0.1.0] - 2024-01-01

### Added
- Project initialization
- Basic project documentation

---

## Version Guidelines

When updating this changelog:

1. Add entries under `[Unreleased]` during development
2. Move unreleased changes to a new version section on release
3. Use the following categories:
   - **Added** - New features
   - **Changed** - Changes in existing functionality
   - **Deprecated** - Soon-to-be removed features
   - **Removed** - Removed features
   - **Fixed** - Bug fixes
   - **Security** - Vulnerability fixes

[Unreleased]: https://github.com/lstasi/Jissue/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lstasi/Jissue/releases/tag/v0.1.0
