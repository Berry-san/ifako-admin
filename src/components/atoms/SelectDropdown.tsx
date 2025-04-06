import React from 'react'

interface OptionObject {
  label: string
  value: string
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: OptionObject[] | string[]
  placeholder?: string
  error?: string
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, options, placeholder = 'Select an option...', error, ...rest },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <select
          ref={ref}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {Array.isArray(options) &&
            options.map((opt) =>
              typeof opt === 'string' ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )
            )}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export default SelectField
