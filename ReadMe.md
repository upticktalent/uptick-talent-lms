# Uptick Talent LMS - Frontend

A modern, scalable Learning Management System (LMS) frontend built with Next.js 15, React 19, and TypeScript. This application provides an intuitive interface for managing educational content, user progress, and learning experiences.

## 🚀 Project Overview

The Uptick Talent LMS Frontend is a comprehensive learning management platform that enables:

- Interactive learning experiences
- User authentication and authorization
- Progress tracking and analytics
- Content management and delivery
- Real-time notifications and updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (with Turbopack)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: Formik + Yup validation
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier
- **Package Manager**: Yarn

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **Yarn**: Version 1.22.19 or higher
- **Git**: For version control

## 🏗️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd uptick-talent-lms/frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   # Create environment file
   cp .env.example .env.local

   # Edit .env.local with your configuration
   # Add your API endpoints, keys, and other environment-specific variables
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `yarn dev`          | Start development server with Turbopack      |
| `yarn build`        | Build the application for production         |
| `yarn start`        | Start the production server                  |
| `yarn lint`         | Run ESLint for code quality checks           |
| `yarn format`       | Format code using Prettier                   |
| `yarn format:check` | Check code formatting without making changes |
| `yarn test`         | Run tests once                               |
| `yarn test:watch`   | Run tests in watch mode                      |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico        # Site favicon
├── components/            # Reusable UI components
│   ├── common/            # Common utility components
│   ├── defaults/          # Default/fallback components
│   ├── modals/            # Modal components
│   ├── ui/                # Base UI components
│   └── index.ts           # Component exports
├── features/              # Feature-based modules
│   ├── home/              # Home page feature
│   └── index.ts           # Feature exports
├── hooks/                 # Custom React hooks
│   └── index.ts           # Hook exports
├── layout/                # Layout components
│   └── index.ts           # Layout exports
├── lib/                   # Library configurations and utilities
│   ├── api/               # API client configuration
│   ├── config/            # App configuration files
│   ├── providers/         # Context providers
│   └── utils.ts           # Utility functions
├── redux/                 # Redux state management
│   ├── reducers/          # Redux reducers and slices
│   ├── store.ts           # Store configuration
│   ├── hooks.tsx          # Typed Redux hooks
│   └── persistor.ts       # Redux persist configuration
├── schema/                # Validation schemas
│   ├── auth/              # Authentication schemas
│   └── dashboard/         # Dashboard schemas
├── types/                 # TypeScript type definitions
│   └── auth.ts            # Authentication types
└── utils/                 # Utility functions
    ├── errors.ts          # Error handling utilities
    ├── formatter.ts       # Data formatting utilities
    └── index.ts           # Utility exports
```

## 🎨 Code Conventions

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use path aliases (`@/*`) for imports
- Export types and interfaces from dedicated files

### React

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance optimization
- Use TypeScript for all component props

### Styling

- Use Tailwind CSS for styling
- We use the shadcn component library in this project. We do **not** use the original HTML elements exported by shadcn (e.g., `<Button />`, `<Input />`) directly; instead, always use the shadcn components as they are, without referencing or importing the HTML tags they wrap.
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Implement consistent spacing and typography scales

### Code Formatting

- **Prettier Configuration**:
  - Single quotes for strings
  - Trailing commas
  - 2-space indentation
  - 100-character line width
  - Semicolons required

### File Naming

- Use PascalCase for components (`UserProfile.tsx`)
- Use camelCase for hooks (`useAuth.ts`)
- Use kebab-case (`user-profile.css`) or lowercase (`userprofile.css`) for every other file.
- Use descriptive, meaningful names

## 🧪 Testing

The project uses Vitest for testing with the following setup:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch
```

Test files should be located alongside the code they test and follow the naming pattern: `*.test.{ts,tsx}`

## 🔗 Integration

### Backend Connection

This frontend connects to the Uptick Talent LMS backend API. Ensure the backend service is running and properly configured.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_NAME=Uptick Talent LMS
# Add other environment-specific variables
```

## 🚀 Deployment

### Production Build

```bash
yarn build
yarn start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b UPT-[issue-number]-[short-feature-description]`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin UPT-[issue-number]-[short-feature-description]`)
5. Open a Pull Request

### Development Workflow

1. Follow the established code conventions
2. Write tests for new features
3. Ensure all tests pass
4. Run linting and formatting before committing
5. Update documentation as needed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [TanStack Query Documentation](https://tanstack.com/query)

## 📞 Support

For questions, issues, or contributions:

- Create an issue in the repository
- Contact the development team
- Check the project documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🎉**
