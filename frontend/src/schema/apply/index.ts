import * as Yup from 'yup';
import { Tracks } from '@/features/apply/types';
import { getters } from '@/lib/config/i18n';

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
    .matches(/^[+]?[-0-9()\s]*$/, i18n.phoneInvalid)
    .test(
      'min-digits',
      i18n.phoneMinDigits,
      value => {
        if (!value) return false; // Fails if empty
        const digits = value.replace(/\D/g, '');
        return digits.length >= 7;
      }
    ),
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