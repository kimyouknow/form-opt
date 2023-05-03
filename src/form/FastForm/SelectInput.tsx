import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import useNotifyRender from 'src/hooks/useNotifyRender'
import { HiChevronDown, HiChevronUp, HiOutlineX } from 'react-icons/hi'
import useDropDown from 'src/hooks/useDropDown'
import { InputRef } from 'src/form/FastForm/useFastForm'

type Option = Array<{ label: string; value: string }>

interface SelectInputProps {
  label: string
  id: string
  placeholder: string
  options: Option
  validate: (v: Option) => string
}

const SelectInput = memo(
  forwardRef<InputRef, SelectInputProps>(({ label, id, placeholder, options, validate }, ref) => {
    const notifyRenderRef = useNotifyRender()
    const { containerRef, isDropdownOpen, handleClickDropdownTrigger, openDropdown } = useDropDown()

    const [value, setValue] = useState<Option>([])
    const [wasTouch, setWasTouch] = useState(false)
    const error = wasTouch && !isDropdownOpen && validate(value)

    useImperativeHandle(ref, () => ({
      getInputValue: () => ({
        value,
        error: validate(value),
      }),
      reset: () => {
        setValue([])
        setWasTouch(false)
      },
    }))

    const handleClick = () => {
      setWasTouch(true)
      openDropdown()
    }

    const addTarget = (_label: string) => {
      const target = options.find(({ label }) => label === _label)!
      const _filtered = [...new Set([...value, target])]
      setValue(_filtered)
      setWasTouch(true)
    }

    const deleteTarget = (_value: string) => {
      const _filtered = value.filter(({ value: v }) => v !== _value)
      setValue(_filtered)
      setWasTouch(true)
    }

    return (
      <div ref={notifyRenderRef} className="flex w-full flex-col p-2">
        <div ref={containerRef} onClick={handleClick}>
          <label className="mb-2 font-semibold" htmlFor={id}>
            {label}
          </label>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="flex w-full justify-between px-2 align-middle">
            {value.length === 0 ? (
              <div className=" text-slate-400">{placeholder}</div>
            ) : (
              <ul className="flex gap-1 align-middle">
                {value.map(({ label, value: v }) => (
                  <li key={label} className="just flex gap-4 rounded bg-slate-200 align-middle">
                    <span className="pl-2">{v}</span>
                    <button onClick={() => deleteTarget(v)}>
                      <HiOutlineX className=" h-full rounded hover:bg-red-500 hover:text-white" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div onClick={handleClickDropdownTrigger}>{isDropdownOpen ? <HiChevronUp /> : <HiChevronDown />}</div>
          </div>
          {isDropdownOpen && (
            <ul>
              {options.map(({ label, value }) => (
                <li key={value} onClick={() => addTarget(label)} className="hover:bg-blue-200">
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }),
)

export default SelectInput
