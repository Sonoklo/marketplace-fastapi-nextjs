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
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={style}
      className={`${fullWidth ? 'w-full' : ''} py-2 px-4 rounded text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
    >
      {isLoading ? 'Загрузка...' : children}
    </button>
  );
}
