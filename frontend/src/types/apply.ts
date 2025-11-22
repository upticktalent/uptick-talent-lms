export enum Tracks {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  FULLSTACK = 'FULLSTACK_DEVELOPMENT',
  MOBILE = 'MOBILE_DEVELOPMENT',
  DATA_SCIENCE = 'DATA_SCIENCE',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  DATA_ANALYSIS = 'DATA_ANALYSIS',
  DATA_ENGINEERING = 'DATA_ENGINEERING',
  UI_DESIGN = 'UI_DESIGN',
  UX_DESIGN = 'UX_DESIGN',
  GRAPHICS_DESIGN = 'GRAPHICS_DESIGN',
  UX_RESEARCH = 'UX_RESEARCH',
  PRODUCT_MARKETING_MANAGEMENT = 'PRODUCT_MARKETING_MANAGEMENT',
  OPERATIONS = 'OPERATIONS',
  SALES = 'SALES',
  BUSINESS_DEVELOPMENT = 'BUSINESS_DEVELOPMENT',
  PROJECT_PRODUCT_MANAGEMENT = 'PROJECT_PRODUCT_MANAGEMENT',
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