import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useIsFavorited, useToggleFavorite } from '../hooks/useFavorites';

interface FavoriteButtonProps {
  vehicleId: string;
  variant?: 'icon' | 'full';
  className?: string;
  /** Render as an overlay button on a card (absolute positioning). */
  floating?: boolean;
}

export function FavoriteButton({
  vehicleId,
  variant = 'icon',
  className,
  floating = false,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const isFavorited = useIsFavorited(vehicleId);
  const toggle = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCustomer) {
      // Sellers/admins can't favorite — silently ignore
      return;
    }

    toggle.mutate(vehicleId);
  };

  if (floating) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white',
          className
        )}
        disabled={toggle.isPending}
      >
        {toggle.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 hover:text-red-500'
            )}
          />
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={toggle.isPending}
        className={className}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {toggle.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              'h-4 w-4',
              isFavorited && 'fill-red-500 text-red-500'
            )}
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={toggle.isPending}
      className={className}
    >
      {toggle.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn('mr-2 h-4 w-4', isFavorited && 'fill-red-500 text-red-500')}
        />
      )}
      {isFavorited ? 'Saved' : 'Save'}
    </Button>
  );
}