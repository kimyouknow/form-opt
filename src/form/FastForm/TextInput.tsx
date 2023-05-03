import { InputHTMLAttributes, MutableRefObject, forwardRef, memo, useImperativeHandle, useState } from 'react'
import { InputRef } from 'src/form/FastForm/useFastForm'
import useNotifyRender from 'src/hooks/useNotifyRender'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  validate: (v: string) => string
}

const TextInput = memo(
  forwardRef<InputRef, TextInputProps>(({ label, id, placeholder, validate, type = 'text', ...rest }, ref) => {
    const notifyRenderRef = useNotifyRender()
    const [value, setValue] = useState('')
    const [wasTouch, setWasTouch] = useState(false)
    const error = wasTouch && validate(value)

    useImperativeHandle(ref, () => ({
      getInputValue: () => ({
        value,
        error: validate(value),
      }),
      reset: () => {
        setValue('')
        setWasTouch(false)
      },
    }))

    const onBlur = () => {
      setWasTouch(true)
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const _value = event.target.value
      setValue(_value)
      if ((ref as MutableRefObject<InputRef>).current.mode !== 'onChange') return
      setWasTouch(true)
    }

    return (
      <div ref={notifyRenderRef} className="flex w-full flex-col p-2">
        <label className="mb-2 font-semibold" htmlFor={id}>
          {label}
        </label>
        <div className="flex items-center">
          <input
            id={id}
            type={type}
            className="w-full rounded-lg border border-gray-400 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="off"
            {...rest}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }),
)

export default TextInput
