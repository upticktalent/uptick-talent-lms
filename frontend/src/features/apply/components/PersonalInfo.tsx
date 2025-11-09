import React from 'react';
import { FormInput, FormCombobox } from './FormInput';
import Box from '@/components/ui/box';
import { useCountryStateCity } from '@/hooks/apply/useCountryStateCity';
import { useFormikContext } from 'formik';
import { ApplicationFormData } from '@/types/apply';
import { SelectItem } from '@/components/ui/select';
import { DatePicker, PhoneNumberInput } from '@/components/common';

export const PersonalInfo = () => {
  const { values, setFieldValue } = useFormikContext<ApplicationFormData>();

  const {
    countryOptions,
    stateOptions,
    cityOptions,
    loadingCountries,
    loadingStates,
    loadingCities,
  } = useCountryStateCity(values.country, values.state);
  
  return (
    <Box>
      <FormInput name="firstName" label="First Name" placeholder="Jane" />
      <FormInput name="lastName" label="Last Name" placeholder="Doe" />
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="jane.doe@example.com"
      />
      <PhoneNumberInput name="phoneNumber" label="Phone Number" />
      <DatePicker name="dateOfBirth" label="Date of Birth" />

      {/* Country */}
      <FormCombobox
        name="country"
        label="Country"
        placeholder={loadingCountries ? 'Loading countries...' : 'Select Country'}
        disabled={loadingCountries}
        options={countryOptions}
        onValueChange={() => {
          setFieldValue('state', '');
          setFieldValue('city', '');
        }}
      />

      {/* State */}
      <FormCombobox
        name="state"
        label="State"
        placeholder={loadingStates ? 'Loading states...' : 'Select State'}
        disabled={!values.country || loadingStates}
        options={stateOptions}
        onValueChange={() => {
          setFieldValue('city', '');
        }}
      />

      {/* City (Updated from FormInput) */}
      <FormCombobox
        name="city"
        label="City"
        placeholder={loadingCities ? 'Loading cities...' : 'Select City'}
        disabled={!values.state || loadingCities}
        options={cityOptions}
      />
    </Box>
  );
};