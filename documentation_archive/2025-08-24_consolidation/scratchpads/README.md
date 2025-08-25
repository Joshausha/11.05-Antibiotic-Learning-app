---
type: project
title: Scratchpads System Documentation
created: 2025-07-11
modified: 2025-07-16
tags: [documentation, scratchpads, issue-tracking, project-management, workflow, antibiotic-app, github, claude-code, development-process]
project: antibiotic-learning-app
status: active
priority: medium
category: documentation
format: readme
scope: scratchpad-system
---

# Scratchpads System

This directory contains planning scratchpads for Claude Code to organize and track work on GitHub issues.

## Purpose

The scratchpad system helps Claude Code:
- Break down complex issues into manageable tasks
- Maintain context between work sessions
- Track progress on multi-step implementations
- Link related issues and PRs
- Document decisions and rationale

## Naming Convention

Scratchpad files should follow this naming pattern:
```
issue-{number}-{title}.md
```

Examples:
- `issue-001-fix-quiz-validation.md`
- `issue-002-add-puppeteer-testing.md`
- `issue-003-improve-bundle-size.md`

## Template Structure

Each scratchpad should include:

1. **Issue Context** - Link to GitHub issue and description
2. **Related Work** - Links to related PRs, issues, or previous work
3. **Task Breakdown** - Atomic tasks with acceptance criteria
4. **Implementation Notes** - Technical decisions and considerations
5. **Testing Strategy** - How to verify the implementation
6. **Progress Tracking** - Checkboxes for completed tasks

## Usage with Custom Commands

Use the custom slash commands with scratchpads:

- `/plan-issue` - Creates a new scratchpad for an issue
- `/code-with-tests` - Reference scratchpad during implementation
- `/test-and-validate` - Update scratchpad with test results
- `/deploy-prep` - Final scratchpad updates before deployment

## Best Practices

1. **Keep scratchpads focused** - One issue per scratchpad
2. **Update regularly** - Keep progress current
3. **Link everything** - Connect related issues and PRs
4. **Document decisions** - Record why certain approaches were chosen
5. **Archive completed work** - Move finished scratchpads to archive/
6. **Medical accuracy** - For content issues, include medical validation steps

## Medical Education Considerations

When working on medical content:
- Always validate medical accuracy
- Include evidence-based sources
- Consider educational outcomes
- Test with medical professionals if possible
- Document clinical reasoning

## File Organization

```
scratchpads/
├── README.md                    # This file
├── template.md                  # Template for new scratchpads
├── issue-xxx-active.md          # Active scratchpads
├── issue-xxx-completed.md       # Completed scratchpads
└── archive/                     # Archived scratchpads
    └── 2025-07/                 # Organized by month
        └── issue-xxx-done.md
```

## Workflow Integration

The scratchpad system integrates with:
- GitHub Issues and PRs
- GitHub Actions workflows
- Custom slash commands
- Testing and validation processes
- Deployment preparation

Remember: The scratchpad system is a tool to help maintain context and organization. Use it to make complex medical education app development more manageable and trackable.