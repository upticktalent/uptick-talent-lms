import * as Yup from 'yup';
import { Tracks } from '@/types/apply';
import { getters } from '@/lib/config/i18n';
import { isValidPhoneNumber } from 'react-phone-number-input';

const i18n = getters.geti18ns().en.apply.validation;

// Step 1: Personal Information
export const PersonalInfoSchema = Yup.object({
  firstName: Yup.string().required(i18n.firstNameRequired),
  lastName: Yup.string().required(i18n.lastNameRequired),
  email: Yup.string()
    .email(i18n.emailInvalid)
    .required(i18n.emailRequired),
  phoneNumber: Yup.string()
    .required(i18n.phoneRequired)
    .test('is-valid-phone', i18n.phoneInvalid, value => {
      // Use the library's validator
      return isValidPhoneNumber(value || '');
      }
    ),
    dateOfBirth: Yup.date().nullable().required(i18n.dateOfBirthRequired).max(new Date(Date.now() - 10 * 365.25 * 24 * 60 * 60 * 1000), 'You must be at least 10 years old'),
    country: Yup.string().required(i18n.countryRequired),
    state: Yup.string().required(i18n.stateRequired),
  city: Yup.string().required(i18n.cityRequired),
});


// Step 2: Track Selection
export const TrackSchema = Yup.object({
  track: Yup.string()
    .oneOf(Object.values(Tracks), i18n.trackRequired)
    .required(i18n.trackRequired),
});

// Step 3: Tools & Experience
export const ToolsSchema = Yup.object().shape({
  frontendTools: Yup.array().when('track', {
    is: Tracks.FRONTEND,
    then: schema =>
      schema.min(1, i18n.toolsRequired).required(),
    otherwise: schema => schema.notRequired(),
  }),
  backendTools: Yup.array().when('track', {
    is: Tracks.BACKEND,
    then: schema =>
      schema.min(1, i18n.toolsRequired).required(),
    otherwise: schema => schema.notRequired(),
  }),
  fullstackTools: Yup.array().when('track', {
    is: Tracks.FULLSTACK,
    then: schema =>
      schema.min(1, i18n.toolsRequired).required(),
    otherwise: schema => schema.notRequired(),
  }),
  mobileTools: Yup.array().when('track', {
    is: Tracks.MOBILE,
    then: schema =>
      schema.min(1, i18n.toolsRequired).required(),
    otherwise: schema => schema.notRequired(),
  }),
});

// Step 4: Referral & Discovery
export const ReferralSchema = Yup.object({
  referralSource: Yup.string()
    .oneOf(
      ['TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'FRIEND', 'OTHER'],
      i18n.referralRequired
    )
    .required(i18n.referralRequired),
  referralSourceOther: Yup.string().when('referralSource', {
    is: 'OTHER',
    then: schema => Yup.string().required(i18n.referralOtherRequired),
    otherwise: schema => schema.notRequired(),
  }),
});

// Step 5: Review & Submit
export const ReviewSchema = Yup.object({
  confirm: Yup.boolean()
    .oneOf([true], i18n.confirmRequired)
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