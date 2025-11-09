import React from 'react';
import { FormInput, FormSelect } from './FormInput';
import Box from '@/components/ui/box';
import { useCountryStateCity } from '@/hooks/apply/useCountryStateCity';
import { useFormikContext } from 'formik';
import { ApplicationFormData } from '@/types/apply';
import { SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/common';

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
      <FormInput
        name="phoneNumber"
        label="Phone Number"
        type="tel"
        placeholder="+1 234 567 890"
      />
      <DatePicker name="dateOfBirth" label="Date of Birth" />

      {/* Country */}
      <FormSelect
        name="country"
        label="Country"
        placeholder={loadingCountries ? 'Loading countries...' : 'Select Country'}
        disabled={loadingCountries}
      >
        {countryOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </FormSelect>

      {/* State */}
      <FormSelect
        name="state"
        label="State"
        placeholder={loadingStates ? 'Loading states...' : 'Select State'}
        disabled={!values.country || loadingStates}
      >
        {stateOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </FormSelect>

      {/* City (Updated from FormInput) */}
      <FormSelect
        name="city"
        label="City"
        placeholder={loadingCities ? 'Loading cities...' : 'Select City'}
        disabled={!values.state || loadingCities}
      >
        {cityOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </FormSelect>
    </Box>
  );
};