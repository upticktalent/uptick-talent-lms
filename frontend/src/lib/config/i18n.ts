const i18nData = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
    login: {
      title: 'Welcome!',
      subtitles: {
        student:
          'Access your courses, submit assignments, track your progress, and stay on top of your learning goals all in one place.',
        mentor:
          'Manage admissions, guide students, track attendance, and provide feedback seamlessly.',
      },
      form: {
        title: 'Log in to your account',
        email: 'Email Address',
        password: 'Password',
        remember: 'Remember me',
        login: 'Login',
        back: 'Back to homepage',
      },
    },
  },
  es: {
    welcome: 'Bienvenido',
    goodbye: 'Adiós',
    login: {
      title: '¡Bienvenido!',
      subtitles: {
        student:
          'Accede a tus cursos, envía tareas, sigue tu progreso y mantente al tanto de tus objetivos de aprendizaje, todo en un solo lugar.',
        mentor:
          'Gestiona admisiones, guía a los estudiantes, registra la asistencia y proporciona comentarios sin problemas.',
      },
      form: {
        title: 'Inicia sesión en tu cuenta',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        remember: 'Recuérdame',
        login: 'Iniciar Sesión',
        back: 'Volver a la página principal',
      },
    },
  },
};

export type LangKey = keyof typeof i18nData;

export const getters = {
  geti18ns: function () {
    return i18nData;
  },
};
