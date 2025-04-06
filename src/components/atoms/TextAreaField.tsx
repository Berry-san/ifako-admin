// components/atoms/TextareaField.tsx
import React from 'react'

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        {label && <label className="text-gray-600">{label}</label>}
        <textarea
          ref={ref}
          {...rest}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'
export default TextareaField
