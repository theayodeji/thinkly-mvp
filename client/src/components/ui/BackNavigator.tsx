import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import clsx from 'clsx';

interface BackNavigatorProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconClassName?: string;
  label?: string;
  onClick?: () => void;
}

export function BackNavigator({
  className,
  iconClassName,
  label = 'Back',
  onClick,
  ...props
}: BackNavigatorProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Go back to the previous page
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={clsx('', className)}
      {...props}
      icon={<ArrowLeft className={clsx('w-4 h-4', iconClassName)} />}
    >
      {label && <span>{label}</span>}
    </Button>
  );
}
