import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
                        'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
                        'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
                        'hover:bg-gray-100/50 hover:text-gray-900': variant === 'ghost',
                        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-10 px-6 py-2': size === 'md',
                        'h-11 px-8 rounded-md': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
