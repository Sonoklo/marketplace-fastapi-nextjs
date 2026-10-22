interface ButtonProps {
  type?: 'submit' | 'button';
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Button({
  type = 'submit',
  disabled = false,
  isLoading = false,
  fullWidth = true,
  children,
  onClick,
  style,
}: ButtonProps) {
  const buttonStyle = {
    backgroundColor: style?.backgroundColor || 'var(--primary)',
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={buttonStyle}
      className={`${fullWidth ? 'w-full' : ''} py-2 px-4 rounded text-white font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? 'Загрузка...' : children}
    </button>
  );
}
