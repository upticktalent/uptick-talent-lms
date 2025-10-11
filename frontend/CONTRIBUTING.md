# Uptick Talent LMS Contributing Guide - Frontend

Thank you for taking the time to contribute!
This guide provides clear instructions for setting up, developing, and contributing to the **Uptick Talent LMS Frontend** project.

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

To get started with the frontend development:

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

3. **Run the development server:**

   - If your feature does **not** depend on the backend server:
     ```bash
     yarn run dev
     ```

   - If your feature requires backend interaction, ensure both frontend and backend servers are running simultaneously.

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
  UPT-7-implement-shared-auth-component
  ```

If the issue title is long, shorten it to a meaningful phrase.
Keep the name in **imperative mode** where possible (e.g., `implement`, `add`, `update`).

---

## 💬 Commit Message Guidelines

All commit messages must begin with a **prefix indicating the type of change** and a concise title in **imperative mode**.

- **Examples:**
  ```bash
  feat: add social login option
  fix: correct button hover state
  chore: update dependencies
  ```

### ✅ Commit Type Prefixes

| Prefix       | Description                                                                        |
| ------------- | ---------------------------------------------------------------------------------- |
| **build**    | Changes that affect the build system or external dependencies (e.g., npm, webpack) |
| **ci**       | Changes to CI configuration (e.g., GitHub Actions, CircleCI)                       |
| **docs**     | Documentation-only changes                                                         |
| **feat**     | A new feature                                                                      |
| **fix**      | A bug fix                                                                          |
| **perf**     | A code change that improves performance                                            |
| **refactor** | Code changes that neither fix a bug nor add a feature                              |
| **style**    | Code style changes (white-space, formatting, missing semicolons, etc.)             |
| **test**     | Adding or updating tests                                                           |

**Tip:** Keep commit messages short, meaningful, and consistent.
Husky will automatically enforce lint and commit standards before each commit.

---

## ✍️ Naming Conventions

Consistent naming ensures readable, maintainable, and predictable code across the team.

### 🔹 Functions
- Use **camelCase**
- Function names should be **verbs** that describe what the function does.

**Example:**
```js
const handleSubmitForm = () => { ... }
const fetchUserData = () => { ... }
```

### 🔹 Variables

- Use **camelCase**

- Variable names should be **nouns** representing data or entities.

**Example:**
```js
const userProfile = {};
let totalStudents = 0;
```
### 🔹 React Components

- **Component Functions:** Use **PascalCase**

- **Component File Names:** Use **lowercase** or **dashed-case**

**Examples:**
```js
// Component function
// Note: We're using JSX syntax — these are not raw HTML tags,
// they are React elements that get rendered as HTML in the browser.
const UserCard = () => {
  return <div>Profile</div>;
}

// File name examples
user-card.jsx
navbar.jsx
```
### 🔹 Constants

- Use **UPPERCASE** with underscores.

**Example:**
```js
const API_BASE_URL = "https://api.upticktalent.com";
const MAX_LOGIN_ATTEMPTS = 3;
```
## 🔀 Pull Request (PR) Process

Before creating a Pull Request (PR):

1. Ensure your branch is up-to-date with the latest main branch:
    ```bash
    git fetch origin
    git merge origin/main
    ```

2. Verify that your implementation meets all acceptance criteria from the issue description.

3. Run linting and tests:
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
  [UPT-7]: Add role-based login experience
  ```
- Add a clear and detailed description of your implementation.
- Include screenshots (for UI-related changes) or a video demo where appropriate.
- Apply the correct PR tags. Create a new one if none match your changes.
- Assign the PR to yourself.
- Request a review by tagging the technical mentor or dev team lead.
- At least one review approval is required before merging.
- Only the team lead or technical mentor should perform merges unless instructed otherwise.

---

## 🧹 Code Quality

We maintain a high-quality codebase through automated and manual checks.

- **Linting:** ESLint enforces consistent code style.
- **Pre-commit hooks:** Husky automatically checks linting and commit messages before commits.
- **Formatting:** Follow the project’s Prettier configuration.
- **Type-checking:** Ensure there are no TypeScript type errors.
- **Hydration:** Confirm that your Next.js components hydrate correctly in React.
- **Console:** Ensure there are no console errors or warnings before pushing changes.

---

## 🧪 Testing

Contributors are expected to write or update **unit tests** whenever new features or fixes are introduced.

**Run tests:**
```bash
npm run test
```

Maintain good test coverage, especially on **critical components and core logic**.

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
- Understand every Git command you use; if unsure, ask before executing.
- Avoid switching to directories unrelated to your track.
- When in doubt, ask for help instead of guessing.

---

## 📞 Need Help?

If you encounter any issue or uncertainty:

- Reach out on the **#team-a-2025-capstone-team** channel in Slack.
- Tag the **technical lead** or **frontend mentor** in your PR or message.
- Don’t hesitate to ask for assistance — collaboration drives success.

We’re all here to help each other succeed 🚀

**Happy Contributing! 💻**
