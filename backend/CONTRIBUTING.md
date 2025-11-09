# Uptick Talent LMS Contributing Guide - Backend

Thank you for taking the time to contribute!
This guide provides clear instructions for setting up, developing, and contributing to the **Uptick Talent LMS Backend** project.

---

## 📚 Table of Contents

1. [Project Setup](#-project-setup)
2. [Branch Naming Convention](#-branch-naming-convention)
3. [Commit Message Guidelines](#-commit-message-guidelines)
4. [Pull Request (PR) Process](#-pull-request-pr-process)
5. [Code Quality](#-code-quality)
6. [Testing](#-testing)
7. [Code of Conduct](#-code-of-conduct)
8. [Need Help?](#-need-help)

---

## 🛠 Project Setup

To get started with the backend development:

1. **Clone the repository**
    ```bash
    git clone https://github.com/upticktalent/uptick-talent-lms.git
    cd uptick-talent-lms
    ```

2. **Install dependencies**
  Upgrade node version to v20 and use yarn as your package manager:
    ```bash
    yarn install
    ```

3. **Set up environment variables**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Update the variables with your local configuration:
    ```bash
    DATABASE_URL=<your_database_connection_string>
    JWT_SECRET=<your_jwt_secret>
    PORT=5000
    ```

4. **Run database migrations (if applicable)**
    ```bash
    yarn run migrate
    ```

5. **Start the development server**
    ```bash
    yarn run dev
    ```

6. **Verify API is running**
    Visit: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🌿 Branch Naming Convention

Branches should clearly reflect the issue they relate to.
Use the **issue number and title** from the **Linear Board** to name your feature branch:

- **Format:**
  ```bash
  UPT-[issue-number]-[short-feature-description]
  ```

- **Example:**
  ```bash
  UPT-12-add-user-authentication-endpoints
  ```

If the issue title is long, shorten it to a meaningful phrase.
Keep the name in **imperative mode** where possible (e.g., `add`, `implement`, `update`).

---

## 💬 Commit Message Guidelines

All commit messages must begin with a **prefix indicating the type of change** and a concise title in **imperative mode**.

- **Examples:**
  ```bash
  feat: implement jwt authentication
  fix: resolve user validation error
  chore: update database seed scripts
  ```

### ✅ Commit Type Prefixes

| Prefix       | Description                                                                        |
| ------------- | ---------------------------------------------------------------------------------- |
| **build**    | Changes that affect the build system or external dependencies (e.g., npm, Docker)  |
| **ci**       | Changes to CI/CD configuration files and scripts                                   |
| **docs**     | Documentation-only changes                                                         |
| **feat**     | A new feature                                                                      |
| **fix**      | A bug fix                                                                          |
| **perf**     | A code change that improves performance                                            |
| **refactor** | Code changes that neither fix a bug nor add a feature                              |
| **style**    | Code style changes (white-space, formatting, etc.)                                 |
| **test**     | Adding or updating tests                                                           |

---
**💡 Tip:**
- Keep commit messages short, meaningful, and consistent.
- Commits should be lowercase so it passes the ci commitlint
- Husky will automatically enforce linting and commit standards before each commit.

---

## ✍️ Naming Conventions

Follow consistent and descriptive naming to maintain clarity across the backend.

### 🔹 Functions

- Use **camelCase**

- Function names should be verbs that describe their action.

**Example:**
```js
const getUserData = () => { ... }
const createNewSession = () => { ... }
```
### 🔹 Variables

- Use **camelCase**

- Variable names should be **nouns** that describe what they store.

**Example:**
```js
let accessToken = "";
const userPayload = {};
```
### 🔹 Constants

Use **UPPERCASE** with underscores.

**Example:**
```js
const MAX_RETRY_LIMIT = 5;
const API_BASE_URL = "https://api.upticktalent.com";
```
### 🔹 Classes

- Use PascalCase for class names.

**Example:**
```js
class UserService { ... }
class AuthController { ... }
```
---

## 🔀 Pull Request (PR) Process

Before creating a Pull Request (PR):

1. Ensure your branch is up-to-date with the latest main branch:
    ```bash
    git fetch origin
    git rebase origin/main
    ```

2. Verify that your implementation meets all acceptance criteria from the issue description.

3. Run linting and tests to ensure everything passes:
    ```bash
    npm run lint
    npm run test
    ```

### When opening a PR:

- Create a PR title using the format below:
- **Format:**
  ```bash
  [issue-number]: Pull request title
  ```
- **Example:**
  ```bash
  [UPT-12]: Add user authentication endpoints
  ```
- Add a clear and detailed description of your implementation.
- Reference the issue number (e.g., “Closes UPT-12”).
- Attach API response examples or screenshots if relevant.
- Apply the correct PR tags.
- Assign the PR to yourself.
- Request a review from the technical mentor or team lead.
- At least one review approval is required before merging.
- Only the team lead or technical mentor should perform merges unless instructed otherwise.

---

## 🧹 Code Quality

We maintain a high-quality codebase through both automated and manual checks.

- **Linting:** ESLint enforces consistent code style and formatting.
- **Pre-commit hooks:** Husky automatically checks linting and commit messages.
- **Formatting:** Follow the project’s Prettier configuration.
- **Error Handling:** Use centralized error-handling middleware for consistency.
- **Validation:** Validate request inputs using libraries like Joi, Zod, or express-validator.
- **Logging:** Use a structured logger (e.g., Winston or Pino) — avoid raw `console.log()` in production.
- **Environment Security:** Never commit `.env` or secret credentials to the repo.
- **Code Structure:** Follow the established folder structure for routes, controllers, services, and models.

---

## 🧪 Testing

Contributors are expected to write or update **unit** and **integration** tests whenever new features or fixes are introduced.

**Run tests:**
```bash
npm run test
```

- Keep tests small, isolated, and descriptive.
- Avoid depending on real external APIs or services — mock them instead.
- Maintain good test coverage, especially for routes, services, and core logic.
- Ensure all tests pass before submitting a PR.

---

## 🤝 Code of Conduct

To maintain a collaborative and respectful work environment, please follow these guidelines:

- Be respectful and inclusive in all discussions.
- Always create and check out to a feature branch for each new implementation.
- Always ensure that your branch is upto date with origin to reduce conflicts.
- Always stash your changes before pulling from the origin.
- Avoid rebasing commits that have already been pushed to remote branches.
- Do not commit unrelated changes to your assigned issue.
- Work only within your assigned branch — avoid modifying other contributors’ branches.
- Communicate blockers or uncertainties early with the team.
- Understand every Git command you use; if unsure, ask before executing.
- Avoid switching to directories unrelated to your backend tasks.
- When in doubt, ask for help instead of guessing.

---

## 📞 Need Help?

If you encounter any issue or uncertainty:

- Reach out on the **#team-a-2025-capstone-team** channel in Slack.
- Tag the **technical lead** or **backend lead** in your PR or message.
- Don’t hesitate to ask for assistance — collaboration is key.

We’re all here to help each other succeed 🚀

**Happy Contributing! 💻**
