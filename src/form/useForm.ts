import { useState } from 'react';

type ValidateChecker<T> = (inputsObj: T) => Record<keyof T, string>;

const FORM_MODE = {
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onBlur: 'onBlur',
} as const;

interface UseFormOptions<T> {
  initialValues: T;
  submitCallback: (inputValues: T) => Promise<void>;
  validate: ValidateChecker<T>;
  mode?: keyof typeof FORM_MODE;
}

export interface UseFormReturns<T> {
  inputValues: T;
  validateError: Record<keyof T, string>;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurHandler: (event: React.FocusEvent<HTMLInputElement>) => void;
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isTargetSatisfyValidate: (...ids: Array<keyof T>) => boolean;
  satisfyAllValidates: boolean;
}

const useForm = <T extends Record<string, string | string[]>>({
  initialValues,
  submitCallback,
  validate,
  mode = FORM_MODE.onChange,
}: UseFormOptions<T>): UseFormReturns<T> => {
  const [inputValues, setInputValues] = useState<T>(initialValues);
  const [validateError, setValidateError] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  const resetInputValues = () => {
    setInputValues(initialValues);
  };

  const resetValidateErrors = () => {
    setValidateError({} as Record<keyof T, string>);
  };

  const satisfyAllValidates: boolean = Object.values(validate(inputValues)).every(
    (value) => !value
  );

  const isTargetSatisfyValidate = (...ids: Array<keyof T>): boolean =>
    ids.every((id) => !validateError[id]);

  const onChangeError = (id: keyof T, value: string) => {
    if (mode === FORM_MODE.onChange || mode === FORM_MODE.onBlur) {
      const res = validate({ ...inputValues, [id]: value });
      setValidateError({ ...validateError, [id]: res[id] });
    } else {
      setValidateError(validate({ ...inputValues, [id]: value }));
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    setInputValues({ ...inputValues, [id]: value });
    if (mode === FORM_MODE.onBlur) return;
    onChangeError(id, value);
  };

  const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>): void => {
    console.log(event);
    const { id, value } = event.target;
    onChangeError(id, value);
  };

  const showEntireError = () => {
    setValidateError(validate({ ...inputValues }));
    Object.values(validateError)
      .filter((error) => error)
      .forEach((error) => {
        alert('error');
      });
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event && event.preventDefault();

    if (!satisfyAllValidates) {
      showEntireError();
      return;
    }
    await submitCallback(inputValues);
    resetInputValues();
    resetValidateErrors();
  };

  return {
    inputValues,
    validateError,
    onChangeHandler,
    onBlurHandler,
    submitHandler,
    satisfyAllValidates,
    isTargetSatisfyValidate,
  };
};

export default useForm;
