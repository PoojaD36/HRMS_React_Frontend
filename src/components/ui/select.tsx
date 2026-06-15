import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

export interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  options: SelectOption[]
  value?: string | number | null
  onChange?: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, value, onChange, placeholder = "Select...", disabled, error, label, required, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectRef = React.useRef<HTMLDivElement>(null)
    const selectedOption = options.find((opt) => opt.value === value)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    const handleSelect = (option: SelectOption) => {
      setIsOpen(false)
      onChange?.(option.value)
    }

    const displayValue = selectedOption?.label || placeholder

    return (
      <div ref={ref} className="w-full" {...props}>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm bg-background border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500" : "border-input",
              "hover:bg-accent/50 transition-colors",
              className
            )}
          >
            <span className={cn(
              "truncate",
              !selectedOption && "text-muted-foreground"
            )}>
              {displayValue}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
          </button>

          {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent transition-colors",
                      "focus:bg-accent focus:outline-none"
                    )}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
