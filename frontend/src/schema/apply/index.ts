import * as Yup from 'yup';

// Step 1: Personal Information
export const PersonalInfoSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required') 
    .matches(/^[+]?[-0-9()\s]*$/, 'Invalid phone number format')
    .test(
      'min-digits',
      'Phone number must be at least 7 digits',
      value => {
        if (!value) return false; // Fails if empty
        const digits = value.replace(/\D/g, '');
        return digits.length >= 7;
      }
    ),
  city: Yup.string().required('City is required'),
});


// Step 2: Track Selection
export const TrackSchema = Yup.object({
  track: Yup.string()
    .oneOf(
      ['FRONTEND', 'BACKEND', 'FULLSTACK_DEVELOPMENT', 'MOBILE_DEVELOPMENT'],
      'Please select a track'
    )
    .required('Please select a track'),
});

// Step 3: Tools & Experience
export const ToolsSchema = Yup.object().shape({
  frontendTools: Yup.array().when('track', {
    is: 'FRONTEND',
    then: schema =>
      schema.min(1, 'Please select at least one tool').required(),
    otherwise: schema => schema.notRequired(),
  }),
  backendTools: Yup.array().when('track', {
    is: 'BACKEND',
    then: schema =>
      schema.min(1, 'Please select at least one tool').required(),
    otherwise: schema => schema.notRequired(),
  }),
  fullstackTools: Yup.array().when('track', {
    is: 'FULLSTACK_DEVELOPMENT',
    then: schema =>
      schema.min(1, 'Please select at least one tool').required(),
    otherwise: schema => schema.notRequired(),
  }),
  mobileTools: Yup.array().when('track', {
    is: 'MOBILE_DEVELOPMENT',
    then: schema =>
      schema.min(1, 'Please select at least one tool').required(),
    otherwise: schema => schema.notRequired(),
  }),
});

// Step 4: Referral & Discovery
export const ReferralSchema = Yup.object({
  referralSource: Yup.string()
    .oneOf(
      ['TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'FRIEND', 'OTHER'],
      'Please select a referral source'
    )
    .required('Please select a referral source'),
  referralSourceOther: Yup.string().when('referralSource', {
    is: 'OTHER',
    then: schema => Yup.string().required('Please specify the source'),
    otherwise: schema => schema.notRequired(),
  }),
});

// Step 5: Review & Submit
export const ReviewSchema = Yup.object({
  confirm: Yup.boolean()
    .oneOf([true], 'You must confirm your information is correct')
    .required(),
});

// Array of schemas to be used by the main form component
export const validationSchemas = [
  PersonalInfoSchema,
  TrackSchema,
  ToolsSchema,
  ReferralSchema,
  ReviewSchema,
];