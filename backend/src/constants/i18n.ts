export const i18n = {
  en: {
    ENVIRONMENT: {
      STAGING: "staging",
      PRODUCTION: "production",
      DEVELOPMENT: "development",
    },
    LOGS: {
      RUNNING_APP: "App up and running on",
      ROUTES: {
        HEALTH_CHECK: {
          SUCCESS: "Service is up and running fine",
        },
        WILDCARD: "Resource not found",
      },
    },
    USERS: {
      SUCCESS: {
        CREATED: "User created successfully",
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        PASSWORD_RESET: "Password reset successfully",
        LIST_RETRIEVED: "Users retrieved successfully",
        RETRIEVED: "User retrieved successfully",
      },
      ERRORS: {
        NOT_FOUND: "User not found",
        EMAIL_REQUIRED: "Email is required",
        FIRST_NAME_REQUIRED: "First name is required",
        LAST_NAME_REQUIRED: "Last name is required",
        ROLE_INVALID: "Role must be either STUDENT or MENTOR",
        EMAIL_EXISTS: "User already exists with this email",
        SELF_DELETE: "You cannot delete your own account",
        INTERNAL_CREATION: "Internal server error during user creation",
        INTERNAL_SERVER: "Internal server error",
      },
      NOTES: {
        TEMP_PASSWORD_DEV: "Save this temporary password as it will not be shown again",
        TEMP_PASSWORD_PROD: "Temporary password has been generated and should be sent to the user via secure channel",
        NEW_PASSWORD_DEV: "Save this new password as it will not be shown again",
        NEW_PASSWORD_PROD: "New password has been generated and should be sent to the user via secure channel",
      },
    },
    VALIDATION: {
      REQUIRED: "is required",
      INVALID_EMAIL: "Please provide a valid email address",
      MIN_LENGTH: "must be at least {min} characters long",
    },
    AUTH: {
      SUCCESS: {
        LOGIN: "Login successful",
        PROFILE_RETRIEVED: "User retrieved successfully", 
        PROFILE_UPDATED: "Profile updated successfully",
        PASSWORD_CHANGED: "Password changed successfully",
        PASSWORD_RESET: "Password reset successfully",
        RESET_EMAIL_SENT: "If an account with that email exists, a password reset link has been sent",
        TOKEN_VALID: "Token is valid",
      },
      ERRORS: {
        EMAIL_PASSWORD_REQUIRED: "Email and password are required",
        INVALID_CREDENTIALS: "Invalid email or password",
        FIRST_LAST_NAME_REQUIRED: "First name and last name are required",
        NAME_CANNOT_BE_EMPTY: "First name and last name cannot be empty",
        CURRENT_NEW_PASSWORD_REQUIRED: "Current password and new password are required",
        PASSWORD_MIN_LENGTH: "New password must be at least 6 characters long",
        INCORRECT_CURRENT_PASSWORD: "Current password is incorrect",
        EMAIL_REQUIRED: "Email is required",
        TOKEN_REQUIRED: "Token is required",
        TOKEN_NEW_PASSWORD_REQUIRED: "Token and new password are required",
        INVALID_EXPIRED_TOKEN: "Invalid or expired reset token",
        INTERNAL_LOGIN: "Internal server error during login",
        INTERNAL_SERVER: "Internal server error",
        INTERNAL_PASSWORD_CHANGE: "Internal server error during password change", 
        INTERNAL_RESET_REQUEST: "Internal server error during password reset request",
        INTERNAL_RESET: "Internal server error during password reset",
        INTERNAL_TOKEN_VALIDATION: "Internal server error during token validation",
      },
    },
    ADMIN: {
      SUCCESS: {
        COHORT_CREATED: "Cohort created successfully",
        COHORTS_RETRIEVED: "Cohorts retrieved successfully",
        STUDENT_CREATED: "Student account created successfully",
        MENTOR_CREATED: "Mentor account created successfully",
        COURSE_CREATED: "Course created successfully",
        COURSES_RETRIEVED: "Courses retrieved successfully",
        USERS_BY_TRACK_RETRIEVED: "Users by track retrieved successfully",
        EMAILS_SENT: "Emails sent successfully",
        APPLICANTS_RETRIEVED: "Applicants retrieved successfully",
        ASSESSMENT_SENT: "Assessment sent to selected applicants",
        ASSESSMENT_PROGRESS_RETRIEVED: "Assessment progress retrieved successfully",
        ASSESSMENT_PASSED: "Assessment evaluated successfully. Applicant passed",
        ASSESSMENT_FAILED: "Assessment evaluated successfully. Applicant failed",
        STUDENT_CREATED_FROM_APPLICANT: "Student account created successfully from applicant",
        BULK_STUDENT_CREATION_COMPLETED: "Bulk student creation process completed",
        DASHBOARD_DATA_RETRIEVED: "Admin dashboard data retrieved successfully",
        APPLICANT_STATUS_UPDATED: "Applicant status updated successfully",
      },
      ERRORS: {
        COHORT_REQUIRED_FIELDS: "Name, track, start date, and end date are required",
        COHORT_EXISTS: "Cohort with this name already exists",
        STUDENT_REQUIRED_FIELDS: "Email, first name, last name, and track are required",
        MENTOR_REQUIRED_FIELDS: "Email, first name, and last name are required",
        COURSE_REQUIRED_FIELDS: "Title, description, track, and cohort ID are required",
        TRACK_REQUIRED: "Track is required",
        EMAIL_REQUIRED_FIELDS: "Applicant IDs, subject, and message are required",
        NO_APPLICANTS_FOUND: "No applicants found with the provided IDs",
        ASSESSMENT_REQUIRED_FIELDS: "Applicant IDs and assessment link are required",
        NO_ELIGIBLE_APPLICANTS: "No eligible applicants found",
        EVALUATION_REQUIRED_FIELDS: "Applicant ID and passed status are required",
        APPLICANT_ASSESSMENT_NOT_FOUND: "Applicant or assessment not found",
        APPLICANT_ID_REQUIRED: "Applicant ID is required",
        APPLICANT_NOT_FOUND: "Applicant not found",
        APPLICANT_IDS_REQUIRED: "Applicant IDs array is required",
        STATUS_UPDATE_REQUIRED_FIELDS: "Applicant ID and status are required",
        INTERNAL_SERVER: "Internal server error",
      },
    },
     
    EMAIL: {
      FROM_DEFAULT: "Uptick Talent <onboarding@resend.dev>",
      GREETING: "Hello {firstName},",
      
      CREDENTIALS: {
        TITLE: "Welcome to Uptick Talent!",
        ACCOUNT_CREATED: "Your {role} account has been created successfully. Here are your login credentials:",
        EMAIL_LABEL: "Email",
        TEMP_PASSWORD_LABEL: "Temporary Password",
        ROLE_LABEL: "Role",
        CHANGE_PASSWORD: "Please login and change your password immediately for security reasons.",
        LOGIN_BUTTON: "Login to Dashboard",
        SECURITY_NOTICE: "Security Notice: Keep your credentials secure and do not share them with anyone.",
        SUBJECT: "Your {role} Account Credentials - Uptick Talent",
      },
      
      APPLICATION_STATUS: {
        TITLE: "Application Status Update",
        STATUS_UPDATED: "Your application status has been updated:",
        CURRENT_STATUS: "Current Status: {status}",
        NOTES_LABEL: "Notes",
        FOLLOW_UP: "We will contact you with further instructions if needed.",
        THANK_YOU: "Thank you for your interest in Uptick Talent!",
        SUBJECT: "Application Status Update - Uptick Talent",
      },
      
      PASSWORD_RESET: {
        TITLE: "Password Reset Request",
        INSTRUCTIONS: "You have requested to reset your password. Click the button below to create a new password:",
        RESET_BUTTON: "Reset Password",
        EXPIRY_NOTICE: "This link will expire in 1 hour for security reasons.",
        IGNORE_IF_NOT_REQUESTED: "If you didn't request this password reset, please ignore this email.",
        SUBJECT: "Reset Your Password - Uptick Talent",
      },
      
      PASSWORD_CHANGED: {
        TITLE: "Password Changed Successfully",
        CONFIRMATION: "Your password has been changed successfully.",
        SECURITY_NOTICE: "If you did not make this change, please contact our support team immediately.",
        CONTACT_SUPPORT_IF_NEEDED: "For security reasons, if you did not initiate this change, please contact our support team immediately.",
        SUBJECT: "Password Changed - Uptick Talent",
      },
      
      BULK: {
        TITLE: "Uptick Talent Announcement",
      },
      
      ROLES: {
        STUDENT: "Student",
        MENTOR: "Mentor",
      },
      
      FOOTER: {
        COPYRIGHT: "© 2024 Uptick Talent. All rights reserved.",
      },
    }
  },
};

// Helper function to get messages (you can expand this for multi-language support)
export const getMessage = (key: string, params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = i18n.en;
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) return key; // Fallback to key if not found
  }
  
  // Replace parameters in the message
  if (params && typeof value === 'string') {
    return value.replace(/{(\w+)}/g, (match, param) => params[param] || match);
  }
  
  return value || key;
};