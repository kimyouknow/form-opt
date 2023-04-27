import { memo } from 'react'
import useNotifyRender from 'src/hooks/useNotifyRender'
import { HiChevronDown, HiChevronUp, HiOutlineX } from 'react-icons/hi'
import useDropDown from 'src/hooks/useDropDown'

interface SelectInputProps<T extends string> {
  label: string
  id: T
  placeholder: string
  value: string[]
  options: Array<Record<string, string>>
  onChange: (event: { target: any; type?: any }) => void
  onBlur: (event: { target: any; type?: any }) => void
  errorMessage: string | null | undefined
}

const SelectInput = memo(
  <T extends string>({
    label,
    id,
    placeholder,
    value,
    options,
    onChange,
    onBlur,
    errorMessage,
  }: SelectInputProps<T>) => {
    const notifyRenderRef = useNotifyRender()
    const { containerRef, isDropdownOpen, handleClickDropdownTrigger, openDropdown } = useDropDown()

    const addTarget = (_value: string) => {
      const _filtered = [...new Set([...value, _value])]
      onChange({
        target: {
          id,
          value: _filtered,
        },
      })
      onBlur({
        target: {
          id,
          value: _filtered,
        },
      })
    }

    const deleteTarget = (_value: string) => {
      const _filtered = value.filter(v => v !== _value)
      onChange({
        target: {
          id,
          value: _filtered,
        },
      })
      onBlur({
        target: {
          id,
          value: _filtered,
        },
      })
    }

    return (
      <div ref={notifyRenderRef} className="flex w-full flex-col p-2">
        <div ref={containerRef} onClick={openDropdown}>
          <label className="mb-2 font-semibold" htmlFor={id}>
            {label}
          </label>
          {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
          <div className="flex w-full justify-between px-2 align-middle">
            {value.length === 0 ? (
              <div className=" text-slate-400">{placeholder}</div>
            ) : (
              <ul className="flex gap-1 align-middle">
                {value.map(v => (
                  <li key={v} className="just flex gap-4 rounded bg-slate-200 align-middle">
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
                <li key={value} onClick={() => addTarget(value)} className="hover:bg-blue-200">
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  },
)

export default SelectInput
