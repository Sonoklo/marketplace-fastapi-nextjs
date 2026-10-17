interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="mb-4 px-4 py-3 rounded bg-red-50 text-red-600 border border-red-600">
      {message}
    </div>
  );
}
