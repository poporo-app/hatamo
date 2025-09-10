interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
}

export default function Card({ title, children, className = '', shadow = true }: CardProps) {
  return (
    <div className={`bg-white rounded-lg ${shadow ? 'shadow-md' : ''} ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}