
# Next.js App Router Template

This project is a [Next.js](https://nextjs.org) application template utilizing the App Router, configured with ESLint, Prettier, Lint-Staged, Husky, Commitlint, and internationalization (i18n) support. It leverages [Bun](https://bun.sh) as the package manager for efficient dependency management and script execution. Additionally, it integrates [ShadCN UI components](https://ui.shadcn.com/) for enhanced design and component consistency.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd next-template
   ```

2. **Install dependencies** with Bun:
   ```bash
   bun install
   ```

3. **Start the development server**:
   ```bash
   bun dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to view the application.

### File Overview

- `.eslintrc.json`: ESLint configuration for code quality.
- `.prettierrc.json` and `.prettierignore`: Prettier configurations for consistent formatting.
- `.lintstagedrc.js`: Lint-Staged configuration to ensure only staged files are linted.
- `commitlint.config.ts`: Commitlint configuration enforcing consistent commit messages.
- `next.config.ts`: Next.js configuration file for additional customization.

## Features

- **App Router**: Uses the Next.js App Router for modern file-based routing.
- **ShadCN UI Integration**: Includes ShadCN UI components for a cohesive and streamlined design.
- **Code Quality Tools**: Integrated with ESLint, Prettier, Lint-Staged, and Husky to ensure clean and consistent code.
- **Commitlint**: Enforces conventional commit messages to maintain a standardized commit history.
- **Internationalization (i18n)**: Pre-configured for multi-language support.
- **Bun Package Manager**: High-performance package manager for dependencies and scripts.
- **BPMN Diagram Visualization**: Automatically detects and renders BPMN 2.0 XML in chat messages as interactive diagrams.

## Usage

### Development
Start the development server with:

```bash
bun dev
```

### Linting and Formatting
- **Lint** the code with ESLint:
  ```bash
  bun lint
  ```
- **Format** the code with Prettier:
  ```bash
  bun format
  ```

### BPMN Diagram Visualization
The application automatically detects and renders BPMN 2.0 XML in chat messages. BPMN XML can be included in the following ways:

1. **Direct XML** - The full BPMN XML included directly in the message
2. **Code Blocks** - BPMN XML enclosed in XML code blocks:
   ```xml
   <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
     <!-- BPMN diagram content -->
   </bpmn:definitions>
   ```

Features:
- **Toggle View** - A button allows switching between diagram visualization and raw XML view
- **Interactive Diagram** - Diagrams can be panned and zoomed for better visualization

To test BPMN rendering, visit `/en/bpmn-test` route which displays a sample BPMN diagram.

### Production
Build and start the application for production:
```bash
bun build
bun start
```

## Dependencies

- **Next.js**: React framework optimized for production.
- **TypeScript**: For type-safe code.
- **ESLint**: Code linting for quality.
- **Prettier**: Enforces consistent code style.
- **Lint-Staged**: Ensures only staged files are linted.
- **Husky**: Manages Git hooks for automated checks.
- **Commitlint**: Enforces commit message standards.
- **ShadCN UI**: Provides a set of UI components for cohesive and streamlined designs.
- **bpmn-js**: Library for visualizing BPMN 2.0 diagrams.

## Configuration

### Environment Variables
Edit `.env.local` to set required environment variables, such as:

- `N8N_BASE_URL`: API endpoint URL for n8n.

## Contributing

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes** following the conventional format:
   ```bash
   git commit -m "feat: add new feature"
   ```
4. **Push the branch**:
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a pull request**.

## License

This project is licensed under the MIT License.