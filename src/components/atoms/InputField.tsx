// components/atoms/InputField.tsx
import React, { useState } from 'react'

interface InputFieldProps {
  label?: string
  placeholder?: string
  value?: string
  name?: string
  type?: string
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  showToggle?: boolean
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      name,
      type = 'text',
      error,
      onChange,
      className = '',
      showToggle = false,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false)

    const inputType =
      showToggle && type === 'password' ? (visible ? 'text' : 'password') : type

    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            value={value}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded bg-[#f4f4f4] ${className}`}
            {...rest}
          />
          {showToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute inset-y-0 right-3 text-sm text-gray-600 cursor-pointer"
            >
              {visible ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

InputField.displayName = 'InputField'
export default InputField
