import React from "react";

type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "range"
  | "checkbox"
  | "radio";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormFieldProps {
  id?: string;
  label?: string;
  type?: FieldType;
  value?: string | number | boolean;
  onChange: (value: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  help?: string;
  className?: string;

  // Textarea specific
  rows?: number;
  resize?: boolean;

  // Select specific
  options?: Option[];

  // Range specific
  min?: number;
  max?: number;
  step?: number;

  // Checkbox/Radio specific
  checked?: boolean;

  // Additional props
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  error,
  help,
  className = "",
  rows = 4,
  resize = true,
  options = [],
  min,
  max,
  step,
  checked,
  icon,
  suffix,
  prefix,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const baseInputStyles = `
    w-full p-3 bg-slate-700/50 border rounded-xl text-slate-100 placeholder-slate-400 
    focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-slate-600/50"}
  `.trim();

  const textareaStyles = `
    ${baseInputStyles} 
    ${resize ? "resize-y" : "resize-none"}
  `.trim();

  const selectStyles = `
    ${baseInputStyles}
    cursor-pointer
  `.trim();

  const checkboxStyles = `
    h-4 w-4 text-sky-500 bg-slate-700 border-slate-600 rounded 
    focus:ring-sky-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const rangeStyles = `
    w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
    slider-thumb focus:outline-none focus:ring-2 focus:ring-sky-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={fieldId}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={textareaStyles}
          />
        );

      case "select":
        return (
          <select
            id={fieldId}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={selectStyles}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "range":
        return (
          <div className="space-y-2">
            <input
              id={fieldId}
              type="range"
              value={(value as number) || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              onBlur={onBlur}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className={rangeStyles}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{min}</span>
              <span className="font-medium text-slate-300">{value}</span>
              <span>{max}</span>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-3">
            <input
              id={fieldId}
              type="checkbox"
              checked={checked || false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              className={checkboxStyles}
            />
            {label && (
              <label
                htmlFor={fieldId}
                className="text-sm text-slate-300 cursor-pointer"
              >
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
          </div>
        );

      case "number":
        return (
          <input
            id={fieldId}
            type="number"
            value={(value as number) || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            className={baseInputStyles}
          />
        );

      default: // text
        return (
          <div className="relative">
            {prefix && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                {prefix}
              </div>
            )}
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                {icon}
              </div>
            )}
            <input
              id={fieldId}
              type="text"
              value={(value as string) || ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className={`
                ${baseInputStyles}
                ${icon || prefix ? "pl-10" : ""}
                ${suffix ? "pr-10" : ""}
              `.trim()}
            />
            {suffix && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                {suffix}
              </div>
            )}
          </div>
        );
    }
  };

  if (type === "checkbox") {
    return (
      <div className={`space-y-1 ${className}`}>
        {renderField()}
        {help && <p className="text-xs text-slate-500">{help}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && type !== "checkbox" && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// Convenience components for common field types
export const TextField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="text" />
);

export const TextareaField: React.FC<Omit<FormFieldProps, "type">> = (
  props,
) => <FormField {...props} type="textarea" />;

export const SelectField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="select" />
);

export const NumberField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="number" />
);

export const RangeField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="range" />
);

export const CheckboxField: React.FC<Omit<FormFieldProps, "type">> = (
  props,
) => <FormField {...props} type="checkbox" />;

export default FormField;
