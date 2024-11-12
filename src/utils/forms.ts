import { useCallback } from 'react';
import { SubmitErrorHandler } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { ObjectSchema, ValidationError } from 'yup';

export const useYupValidationResolver = (validationSchema: ObjectSchema<object>) =>
  useCallback(
    async (data: object) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: (errors as ValidationError).inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path as string]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );

export const onSubmitError: SubmitErrorHandler<object> = (errors) => {
  Toast.show({
    type: 'error',
    text1: Object.values(errors)[0]?.message,
  });
};
