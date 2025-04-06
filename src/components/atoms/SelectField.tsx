// components/atoms/SelectField.tsx
import { forwardRef, SelectHTMLAttributes } from 'react'

interface OptionType {
  value: string
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: OptionType[]
  className?: string
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, className = '', ...rest }, ref) => {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <select
          ref={ref}
          className={`w-full px-4 py-2 border border-gray-300 rounded bg-[#f4f4f4] ${className}`}
          {...rest}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
export default SelectField
