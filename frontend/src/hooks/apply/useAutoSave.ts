import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { setLocalItem, getLocalItem, removeLocalItem } from '@/lib/config';
import { ApplicationFormData } from '@/features/apply/types';
import { useDebounce } from 'use-debounce'; 

const STORAGE_KEY = 'uptick_application_draft';

export const useAutoSave = () => {
  const { values } = useFormikContext<ApplicationFormData>();
  const [debouncedValues] = useDebounce(values, 500); // Debounce to avoid excessive writes

  useEffect(() => {
    setLocalItem({ key: STORAGE_KEY, value: debouncedValues });
  }, [debouncedValues]);
};

export const getSavedDraft = (): ApplicationFormData | null => {
  return getLocalItem<ApplicationFormData>({ key: STORAGE_KEY });
};

export const clearSavedDraft = () => {
  removeLocalItem({ key: STORAGE_KEY });
};