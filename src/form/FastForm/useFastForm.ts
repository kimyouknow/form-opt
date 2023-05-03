import { RefObject, useState } from 'react'
import { useRef } from 'react'

const FORM_MODE = {
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onBlur: 'onBlur',
} as const

export interface InputRef {
  mode?: keyof typeof FORM_MODE
  getInputValue: () => {
    value: string | any
    error: string
  }
  reset: () => void
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

const getEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>

type ValidateChecker<T> = Record<keyof T, (v: any) => string>

interface UseFormOptions<T> {
  initialValues: T
  submitCallback: (inputValues: T) => Promise<void>
  validate: ValidateChecker<T>
  mode?: keyof typeof FORM_MODE
}

export type ChangeHandler = (event: { target: any; type?: any }) => void

const useFastForm = <T extends Record<string, string | any[]>>({
  initialValues,
  submitCallback,
  validate,
  mode = FORM_MODE.onChange,
}: UseFormOptions<T>) => {
  const inputRefs = getEntries(initialValues).reduce((acc, [key, value]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    acc[key] = useRef<InputRef>({
      mode,
      getInputValue: () => ({
        value: '',
        error: '',
      }),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      reset: () => {},
    })
    return acc
  }, {} as Record<keyof T, RefObject<InputRef>>)

  const register = <K extends keyof T>(id: K) => {
    return {
      id,
      ref: inputRefs[id],
      validate: validate[id],
    }
  }

  const getInputValues = (type: 'value' | 'error') =>
    getEntries(inputRefs).reduce((acc, [key, _ref]) => {
      const _value = _ref.current?.getInputValue()[type] || ''
      acc[key] = _value as T[keyof T]
      return acc
    }, {} as T)

  const satisfyAllValidates: boolean = Object.values(getInputValues('error')).every(value => !value)

  // !ref기반이라서 변화가 일어날 때 마다 실시간 검증이 안 됨
  const isTargetSatisfyValidate = (...ids: Array<keyof T>): boolean => {
    const _errors = getInputValues('error')
    return ids.every(id => !_errors[id])
  }

  const resetInputsValue = () => getEntries(inputRefs).forEach(([key, _ref]) => _ref.current?.reset())

  const showEntireError = () => {
    Object.values(getInputValues('error'))
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

    const inputValues = getInputValues('value')
    await submitCallback(inputValues)
    resetInputsValue()
  }

  return {
    submitHandler,
    register,
    isTargetSatisfyValidate,
  }
}

export default useFastForm
