# Contributing Guide

Welcome to the Soulara frontend project! This guide will help you get started with contributing to our codebase.

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [💻 Development Setup](#-development-setup)
- [📏 Code Standards](#-code-standards)
- [📝 Commit Guidelines](#-commit-guidelines)
- [🔄 Pull Request Process](#-pull-request-process)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [📚 Documentation Standards](#-documentation-standards)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 18.17.0)
- **npm** (>= 9.0.0)
- **Git**
- **VSCode** (recommended) with suggested extensions

### Development Environment Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/build-to-bond-backend.git
   cd build-to-bond-backend/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 💻 Development Setup

### VSCode Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Git Hooks Setup

We use Husky for Git hooks to ensure code quality:

```bash
# Install and setup Husky
npm run prepare
```

This will automatically:
- Run linting on staged files
- Run type checking
- Format code with Prettier

## 📏 Code Standards

### TypeScript Guidelines

1. **Use strict typing**
   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   // ❌ Avoid
   const user: any = getData();
   ```

2. **Define interfaces for props**
   ```typescript
   // ✅ Good
   interface ButtonProps {
     children: React.ReactNode;
     variant?: 'primary' | 'secondary';
     onClick?: () => void;
   }
   
   const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick }) => {
     return <button onClick={onClick}>{children}</button>;
   };
   ```

3. **Use type guards for runtime checks**
   ```typescript
   // ✅ Good
   const isUser = (data: unknown): data is User => {
     return typeof data === 'object' && data !== null && 'id' in data;
   };
   ```

### React Guidelines

1. **Component Organization**
   ```typescript
   // ✅ Good component structure
   import React, { useState, useEffect } from 'react';
   import { Button } from '@/components/ui/button';
   import { useAuth } from '@/hooks/useAuth';
   
   interface ComponentProps {
     // Props definition
   }
   
   export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
     // Hooks
     const { user } = useAuth();
     const [state, setState] = useState();
     
     // Effects
     useEffect(() => {
       // Effect logic
     }, []);
     
     // Event handlers
     const handleClick = () => {
       // Handler logic
     };
     
     // Early returns
     if (!user) return null;
     
     // Render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   };
   ```

2. **Custom Hooks**
   ```typescript
   // ✅ Good custom hook
   export const useChat = (chatId: string) => {
     const [messages, setMessages] = useState<Message[]>([]);
     const [loading, setLoading] = useState(false);
     
     const sendMessage = useCallback(async (content: string) => {
       // Implementation
     }, [chatId]);
     
     return {
       messages,
       loading,
       sendMessage,
     };
   };
   ```

### Styling Guidelines

1. **Use Tailwind CSS classes**
   ```tsx
   // ✅ Good
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
     <h2 className="text-lg font-semibold text-gray-900">Title</h2>
   </div>
   ```

2. **Use CSS variables for theme values**
   ```css
   /* ✅ Good */
   .custom-component {
     background-color: hsl(var(--primary));
     color: hsl(var(--primary-foreground));
   }
   ```

3. **Component-specific styles in CSS modules when needed**
   ```typescript
   // ✅ For complex styling
   import styles from './Component.module.css';
   
   <div className={styles.complexComponent}>
   ```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat(auth): add social login integration"

# Bug fix
git commit -m "fix(chat): resolve message ordering issue"

# Documentation
git commit -m "docs: update API integration guide"

# Breaking change
git commit -m "feat!: migrate to new authentication system

BREAKING CHANGE: The authentication API has changed.
Users need to re-authenticate after this update."
```

## 🔄 Pull Request Process

### 1. Branch Naming

Use descriptive branch names:

```bash
# Features
git checkout -b feature/social-login
git checkout -b feature/chat-improvements

# Bug fixes
git checkout -b fix/message-ordering
git checkout -b fix/auth-token-refresh

# Documentation
git checkout -b docs/api-integration

# Refactoring
git checkout -b refactor/component-structure
```

### 2. Before Submitting

Run the following checks:

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Tests
npm run test

# Build
npm run build
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

## Screenshots (if applicable)
Add screenshots for UI changes.
```

### 4. Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approval required
3. **Testing**: Manual testing if needed
4. **Merge**: Squash and merge after approval

## 🧪 Testing Guidelines

### Unit Testing

```typescript
// Example test file: Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```typescript
// Example integration test
import { render, screen, waitFor } from '@testing-library/react';
import { ChatWindow } from './ChatWindow';
import { mockChatData } from '../__mocks__/chatData';

describe('ChatWindow Integration', () => {
  it('loads and displays chat messages', async () => {
    render(<ChatWindow chatId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(mockChatData.messages[0].content)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```typescript
// Example Cypress test
describe('Authentication Flow', () => {
  it('should allow user to login', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('user@example.com');
    cy.get('[data-testid=password-input]').type('password');
    cy.get('[data-testid=login-button]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid=user-menu]').should('be.visible');
  });
});
```

## 📚 Documentation Standards

### Component Documentation

```typescript
/**
 * Button component for user interactions
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
};
```

### Hook Documentation

```typescript
/**
 * Custom hook for chat functionality
 * 
 * @param chatId - Unique identifier for the chat
 * @returns Chat state and methods
 * 
 * @example
 * ```tsx
 * const { messages, sendMessage, loading } = useChat('chat-123');
 * ```
 */
export const useChat = (chatId: string) => {
  // Implementation
};
```

### API Documentation

```typescript
/**
 * Sends a message in a chat
 * 
 * @param chatId - Chat identifier
 * @param content - Message content
 * @param type - Message type (text, image, etc.)
 * @returns Promise resolving to the sent message
 * 
 * @throws {ValidationError} When content is invalid
 * @throws {AuthenticationError} When user is not authenticated
 */
export const sendMessage = async (
  chatId: string,
  content: string,
  type: MessageType = 'text'
): Promise<Message> => {
  // Implementation
};
```

## ❓ Getting Help

### Resources

- **Documentation**: Check existing docs in `/docs` folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our development Discord server

### Contact

- **Maintainers**: Tag @maintainers in issues/PRs
- **Email**: dev@soulara.app
- **Discord**: [Development Server](https://discord.gg/soulara-dev)

## 🎯 Code Review Checklist

### For Authors

- [ ] Code follows style guide
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No commented out code
- [ ] Performance considerations addressed
- [ ] Security implications considered
- [ ] Accessibility guidelines followed

### For Reviewers

- [ ] Code is readable and maintainable
- [ ] Logic is sound and efficient
- [ ] Tests adequately cover changes
- [ ] Documentation is clear and accurate
- [ ] No security vulnerabilities
- [ ] Performance impact is acceptable
- [ ] Breaking changes are documented

## 🔄 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Pre-release**
   - [ ] All tests passing
   - [ ] Documentation updated
   - [ ] CHANGELOG updated
   - [ ] Version bumped

2. **Release**
   - [ ] Create release branch
   - [ ] Final testing
   - [ ] Create GitHub release
   - [ ] Deploy to production

3. **Post-release**
   - [ ] Verify deployment
   - [ ] Monitor for issues
   - [ ] Update project board

Thank you for contributing to Soulara! 🚀