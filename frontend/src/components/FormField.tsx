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
        className="block mb-2 text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
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
        className="w-full px-4 py-2 rounded border focus:outline-none"
        style={{
          backgroundColor: 'var(--inset)',
          borderColor: error ? 'var(--error)' : 'var(--border)',
          color: 'var(--text-primary)',
        }}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{error}</p>
      )}
    </div>
  );
}
