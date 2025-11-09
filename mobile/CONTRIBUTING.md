# Contributing to Uptick Talent LMS (Mobile)

Thank you for your interest in contributing! 🎉  
This document outlines the contribution workflow, coding standards, and development setup for the **Uptick Talent LMS Mobile** project.

Our goal is to make the process smooth and consistent for everyone — whether you’re fixing a bug, adding a feature, or improving documentation.

---

### Prerequisites

Make sure you have the following installed:

- **Flutter SDK:** `>=3.0.0`
- **Dart SDK:** `>=3.0.0`
- **Git**
- **Android Studio** or **VS Code** (with Flutter/Dart extensions)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/upticktalent/uptick-talent-lms.git
   cd uptick-talent-lms/mobile
   ```

2. **Install dependencies**

   ```bash
   flutter pub get
   ```

3. **Run the app**

   ```bash
   flutter run
   ```

4. **Build for production**
   ```bash
   flutter build apk
   ```

---

## Branch Naming Convention

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

## 📝 Commit Message Guidelines

All commit messages must begin with a **prefix indicating the type of change** and a concise title in **imperative mode**.

- **Examples:**
  ```bash
  feat: add social login option
  fix: correct token refresh logic                        |
  chore: update dependencies
  ```

### ✅ Commit Type Prefixes

| Prefix       | Description                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| **build**    | Changes that affect the build system or external dependencies (e.g., npm, webpack) |
| **ci**       | Changes to CI configuration (e.g.,                                                 |
| **docs**     | Documentation-only changes                                                         |
| **feat**     | A new feature                                                                      |
| **fix**      | A bug fix                                                                          |
| **perf**     | A code change that improves performance                                            |
| **refactor** | Code changes that neither fix a bug nor add a feature                              |
| **style**    | Code style changes (white-space, formatting, missing semicolons, etc.)             |
| **test**     | Adding or updating tests                                                           |

---

## Code Quality Standards

Before committing or pushing your changes, run the following checks:

### Lint and Format

```bash
flutter analyze
dart format .
```

### Run Tests

```bash
flutter test
```

Ensure **all tests pass** before opening a pull request.

---

## Pull Request (PR) Process

1.  Ensure your branch is **up to date** with `main`:

```bash
git fetch origin
git merge origin/main
```

2. Verify that your implementation meets all acceptance criteria from the issue description.

3. Commit and push your changes:

   ```bash
   git add .
   git commit -m "[UPT-7]: Added authentication logic"
   git push origin feature/add-login-ui
   ```

4. Open a Pull Request (PR) on GitHub:

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

5. Before requesting review:

   - Code is formatted and lint-free
   - Tests pass successfully
   - PR description explains the change clearly

6. Wait for at least **one code review approval** before merging.

---

## 🧾 Issue Reporting

If you find a bug or want to request a new feature:

1. Go to the **Issues** tab in the repository.
2. Choose the correct template (**Bug Report** or **Feature Request**).
3. Provide the following details:
   - A clear and concise **title**
   - **Steps to reproduce** the issue
   - **Expected vs. actual behavior**
   - **Screenshots or screen recordings** (if applicable)
   - **Device or OS information** (e.g., Android/iOS version)

---

## 🎥 Desk Checks & Recordings

To maintain design and product quality, all features must go through a **desk check** process before final approval:

- **Recordings:**  
  Each contributor should attach a short **screen recording or demo video** showing the implemented feature in action.  
  This helps reviewers, PMs, and designers validate the flow and confirm UI/UX alignment.

- **Desk Check Validation:**

  - The **Project Manager (PM)** and **Design Team** will review the recordings.
  - They will validate design accuracy and user experience.
  - Feedback from this validation should be addressed before merging the PR.

- **Resource Allocation:**  
  The **Team Lead** is responsible for assigning contributors and ensuring that desk checks are completed before the feature is approved.

---

## Code of Conduct

Please note that this project follows a [Code of Conduct](../CODE_OF_CONDUCT.md).  
By participating, you agree to uphold this standard in all interactions.

---

## Need Help?

If you get stuck:

- Check the **README.md** for setup and build instructions
- Reach out via the team’s Slack or GitHub Discussions
- Or mention a maintainer in your PR for guidance

---

### Thank You for Contributing!

Your time and effort make this project better for everyone.  
Let’s build something amazing together
