import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axios from 'axios';

const CSC_API_KEY = process.env.NEXT_PUBLIC_CSC_API_KEY || '';
const CSC_API_URL = 'https://api.countrystatecity.in/v1';

const cscApiClient = axios.create({
  baseURL: CSC_API_URL,
  headers: {
    'X-CSCAPI-KEY': CSC_API_KEY,
  },
});

// Type definitions for API responses
interface Country {
  iso2: string;
  name: string;
}
interface State {
  iso2: string;
  name: string;
}
interface City {
  name: string;
  id: number;
}

// Fetcher functions
const fetchCountries = async (): Promise<Country[]> => {
  const response = await cscApiClient.get('/countries');
  return response.data;
};

const fetchStates = async (countryIso: string): Promise<State[]> => {
  const response = await cscApiClient.get(`/countries/${countryIso}/states`);
  return response.data;
};

const fetchCities = async (countryIso: string, stateIso: string): Promise<City[]> => {
  const response = await cscApiClient.get(`/countries/${countryIso}/states/${stateIso}/cities`);
  return response.data;
};

// The main hook
export const useCountryStateCity = (countryIso?: string, stateIso?: string) => {
  // 1. Fetch all countries
  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });

  // 2. Fetch states for the selected country
  const { data: states, isLoading: loadingStates } = useQuery({
    queryKey: ['states', countryIso],
    queryFn: () => fetchStates(countryIso!),
    enabled: !!countryIso,
  });

  // 3. Fetch cities for the selected state
  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['cities', countryIso, stateIso],
    queryFn: () => fetchCities(countryIso!, stateIso!),
    enabled: !!countryIso && !!stateIso,
  });

  // 4. Memoize the formatted options for <SelectItem>
  const countryOptions = useMemo(
    () =>
      countries?.map(country => ({
        value: country.iso2,
        label: country.name,
      })) || [],
    [countries],
  );

  const stateOptions = useMemo(
    () => states?.map(state => ({ value: state.iso2, label: state.name })) || [],
    [states],
  );

  const cityOptions = useMemo(
    () => cities?.map(city => ({ value: city.name, label: city.name })) || [],
    [cities],
  );

  return {
    countryOptions,
    stateOptions,
    cityOptions,
    loadingCountries,
    loadingStates,
    loadingCities,
  };
};
