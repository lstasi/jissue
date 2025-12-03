# TODO - Jissue Development Roadmap

## Phase 1: Project Foundation

- [x] Set up VSCode extension project structure
- [x] Configure TypeScript and ESLint
- [x] Set up testing framework (Mocha/Jest)
- [x] Create extension manifest (package.json with VS Code extension fields)

## Phase 2: Authentication

- [x] Implement secure token storage using VS Code SecretStorage API
- [x] Create settings/configuration UI for Jira credentials
- [x] Add Jira connection validation
- [x] Handle authentication errors gracefully

## Phase 3: Issue Listing

- [x] Create TreeView for displaying Jira issues
- [x] Implement JQL query execution
- [x] Add custom query support
- [x] Implement pagination for large result sets
- [x] Add quick filters (My Issues, Recent, etc.)
- [x] Move Jira issues from Explorer to custom sidebar view
- [x] Add Jira icon to sidebar view container

## Phase 4: Branch Management

- [ ] Detect current Git repository
- [ ] Generate branch names from issue keys
- [ ] Create and checkout new branches
- [ ] Update issue status to "In Progress" via Jira API
- [ ] Handle existing branches gracefully

## Phase 5: AI Agent Integration

- [ ] Generate Markdown file with issue details
- [ ] Include issue description, acceptance criteria, and comments
- [ ] Format output for AI agent consumption
- [ ] Support customizable Markdown templates

## Phase 6: Polish & Release

- [ ] Add extension icon and branding
- [ ] Write comprehensive documentation
- [ ] Create demo/walkthrough video
- [ ] Publish to VS Code Marketplace
- [ ] Set up automated release pipeline

## Future Enhancements

- [ ] Issue creation from VS Code
- [ ] Comment on issues directly
- [ ] Time tracking integration
- [ ] Sprint view
- [ ] Kanban board view
- [ ] Multiple Jira instance support
