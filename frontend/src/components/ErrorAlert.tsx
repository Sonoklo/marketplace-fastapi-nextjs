interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div
      className="mb-4 px-4 py-3 rounded"
      style={{
        backgroundColor: 'var(--error-bg)',
        color: 'var(--error)',
        border: `1px solid var(--error)`,
      }}
    >
      {message}
    </div>
  );
}
