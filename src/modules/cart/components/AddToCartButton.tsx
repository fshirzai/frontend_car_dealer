import { ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useAddToCart, useIsInCart } from '../hooks/useCart';

interface AddToCartButtonProps {
  vehicleId: string;
  variant?: 'full' | 'icon';
  className?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  vehicleId,
  variant = 'full',
  className,
  disabled,
}: AddToCartButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const isInCart = useIsInCart(vehicleId);
  const addToCart = useAddToCart();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCustomer) return;
    if (isInCart) {
      navigate('/account/cart');
      return;
    }
    addToCart.mutate(vehicleId);
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={disabled || addToCart.isPending}
        className={className}
      >
        {addToCart.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className={cn('h-4 w-4', isInCart && 'text-primary')} />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={disabled || addToCart.isPending}
      className={className}
    >
      {addToCart.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className={cn('mr-2 h-4 w-4', isInCart && 'text-primary')} />
      )}
      {isInCart ? 'In cart' : 'Add to cart'}
    </Button>
  );
}