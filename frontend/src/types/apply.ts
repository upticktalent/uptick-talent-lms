export enum Tracks {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  FULLSTACK = 'FULLSTACK_DEVELOPMENT',
  MOBILE = 'MOBILE_DEVELOPMENT',
}

export type ApplicationFormData = {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | undefined;
  dateOfBirth: Date | null;
  country: string;
  state: string;
  city: string;

  // Step 2
 track: Tracks | '';

  // Step 3
  frontendTools: string[];
  frontendToolsOther: string;
  backendTools: string[];
  backendToolsOther: string;
  fullstackTools: string[];
  fullstackToolsOther: string;
  mobileTools: string[];
  mobileToolsOther: string;

  // Step 4
  referralSource: string;
  referralSourceOther: string;

  // Step 5
  confirm: boolean;
};