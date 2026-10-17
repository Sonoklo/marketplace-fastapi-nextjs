interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  error?: string;
  placeholder?: string;
}

export default function FormField({
  id,
  label,
  type,
  value,
  onChange,
  onClearError,
  error,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error && onClearError) onClearError();
        }}
        className={`w-full px-4 py-2 rounded border focus:outline-none ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
