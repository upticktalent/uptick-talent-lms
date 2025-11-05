import { useFormik, FormikHelpers, FormikValues } from 'formik';
import { ObjectSchema } from 'yup';

interface UseFormHandlerProps<T> {
  initialValues: T;
  validationSchema: ObjectSchema<Record<string, unknown>>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void> | void;
}

export const useFormHandler = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormHandlerProps<T>) => {
  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return formik;
};
