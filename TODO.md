# TODO - Jissue Development Roadmap

## Phase 1: Project Foundation

- [x] Set up VSCode extension project structure
- [x] Configure TypeScript and ESLint
- [x] Set up testing framework (Mocha/Jest)
- [x] Create extension manifest (package.json with VS Code extension fields)

## Phase 2: Authentication

- [ ] Implement secure token storage using VS Code SecretStorage API
- [ ] Create settings/configuration UI for Jira credentials
- [ ] Add Jira connection validation
- [ ] Handle authentication errors gracefully

## Phase 3: Issue Listing

- [ ] Create TreeView for displaying Jira issues
- [ ] Implement JQL query execution
- [ ] Add custom query support
- [ ] Implement pagination for large result sets
- [ ] Add quick filters (My Issues, Recent, etc.)

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
