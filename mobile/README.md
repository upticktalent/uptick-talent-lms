# Uptick Talent LMS (Mobile)

A modern Learning Management System (LMS) built with **Flutter**, designed to provide a seamless learning experience for students and instructors.

## Project Overview

The **Uptick Talent LMS** app allows users to:

- Enroll in courses
- Track progress and performance
- Access course materials
- Communicate with instructors and peers

**Supported Platforms:**  
Android  
iOS

**Core Technologies:**

- Flutter
- Dart
- Riverpod (State Management)
- Clean Architecture Pattern

---

## Prerequisites

- **Flutter SDK:** `>=3.0.0`
- **Dart SDK:** `>=3.0.0`
- Ensure you have Android Studio or VS Code set up with Flutter and Dart extensions.

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/upticktalent/uptick-talent-lms.git
   cd uptick-talent-lms/mobile
   ```

2. **Install Dependencies**

   ```bash
   flutter pub get
   ```

3. **Run the App**

   ```bash
   flutter run
   ```

4. **Build for Production**
   ```bash
   flutter build apk   # For Android
   flutter build ios   # For iOS
   ```

---

## Folder Structure

```
mobile/
├── lib/
│   ├── core/               # Common utilities, constants
│   ├── features/           # Feature modules (auth, dashboard, etc.)
│   ├── models/             # Data models
│   ├── screens/            # UI screens
│   ├── services/           # API and data services
│   ├── widgets/            # Shared UI components
│   └── main.dart           # App entry point
├── test/                   # Unit and widget tests
├── pubspec.yaml            # Project dependencies
└── README.md               # Project documentation
```

---

## Environment Configuration

If your project uses environment variables or flavors:

- Copy `.env.example` to `.env`
- Update environment values as needed

Example:

```bash
API_BASE_URL=https://api.upticktalent.com
```

---

## Contributing

Contributions are welcome!  
Please see the [`CONTRIBUTING.md`](../CONTRIBUTING.md) file for detailed contribution guidelines.

---

## Useful Links

- [Design Files (Figma)](<[text](https://www.figma.com/proto/LhrlHM7LLUis7NDRVVIFcl/UTF-LMS?node-id=47-41988&p=f&t=eDIbIu1ysH8gWm0P-0&scaling=min-zoom&content-scaling=fixed&page-id=34%3A1507)>)
- [Flutter Documentation](https://flutter.dev/docs)

---

## License

This project is licensed under the [MIT License](LICENSE).
