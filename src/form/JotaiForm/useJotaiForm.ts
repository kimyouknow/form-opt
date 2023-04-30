import { useState } from 'react'

type ValidateChecker<T> = (inputsObj: T) => Record<keyof T, string>

export const EVENTS = {
  BLUR: 'blur',
  FOCUS_OUT: 'focusout',
  CHANGE: 'change',
}

const FORM_MODE = {
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onBlur: 'onBlur',
} as const

interface UseFormOptions<T> {
  initialValues: T
  submitCallback: (inputValues: T) => Promise<void>
  validate: ValidateChecker<T>
  mode?: keyof typeof FORM_MODE
}

export type ChangeHandler = (event: { target: any; type?: any }) => void

interface Control<T> {
  id: keyof T
  onChange: ChangeHandler
  onBlur: ChangeHandler
  value: string | string[]
  errorMessage: string
}

export interface UseFormReturns<T> {
  inputValues: T
  validateError: Record<keyof T, string>
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  isTargetSatisfyValidate: (...ids: Array<keyof T>) => boolean
  satisfyAllValidates: boolean
  register: (id: keyof T, isInput?: boolean) => Control<T>
}

const useJotaiForm = <T extends Record<string, string | string[]>>({
  initialValues,
  submitCallback,
  validate,
  mode = FORM_MODE.onChange,
}: UseFormOptions<T>) => {
  const [inputValues, setInputValues] = useState<T>(initialValues)
  const [validateError, setValidateError] = useState<Record<keyof T, string>>({} as Record<keyof T, string>)

  const resetInputValues = () => {
    setInputValues(initialValues)
  }

  const resetValidateErrors = () => {
    setValidateError({} as Record<keyof T, string>)
  }

  const satisfyAllValidates: boolean = Object.values(validate(inputValues)).every(value => !value)

  const isTargetSatisfyValidate = (...ids: Array<keyof T>): boolean => ids.every(id => !validateError[id])

  const onChangeError = (id: keyof T, value: string) => {
    if (mode === FORM_MODE.onSubmit) {
      setValidateError(validate({ ...inputValues, [id]: value }))
    } else {
      const res = validate({ ...inputValues, [id]: value })
      setValidateError({ ...validateError, [id]: res[id] })
    }
  }

  const onBlur: ChangeHandler = event => {
    const { id, value } = event.target
    setInputValues({ ...inputValues, [id]: value })
    onChangeError(id, value)
  }

  const onChange: ChangeHandler = event => {
    const { id, value } = event.target
    setInputValues({ ...inputValues, [id]: value })
    if (mode === FORM_MODE.onBlur) return
    onChangeError(id, value)
  }

  const register = <K extends keyof T>(id: K) => {
    return {
      id,
      onChange,
      onBlur,
      value: inputValues[id],
      errorMessage: validateError[id],
    }
  }

  const showEntireError = () => {
    setValidateError(validate({ ...inputValues }))
    Object.values(validateError)
      .filter(error => error)
      .forEach(error => {
        alert('Error on Submit')
      })
  }

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event && event.preventDefault()

    if (!satisfyAllValidates) {
      showEntireError()
      return
    }
    await submitCallback(inputValues)
    resetInputValues()
    resetValidateErrors()
  }

  return {
    inputValues,
    validateError,
    submitHandler,
    satisfyAllValidates,
    isTargetSatisfyValidate,
    register,
  }
}

export default useJotaiForm
