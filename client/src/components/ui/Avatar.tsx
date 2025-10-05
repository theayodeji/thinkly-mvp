// Simple utility to merge class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
};

export const Avatar = ({
  src,
  alt = 'User avatar',
  className,
  size = 'md',
  fallback
}: AvatarProps) => {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-full bg-muted overflow-hidden outline-none',
        'border-2 border-border',
        'select-none',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-foreground/70">
          {getInitials(fallback)}
        </span>
      )}
    </div>
  );
};
