'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string; // For the modal content container
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Dialog({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    className,
    size = 'md'
}: DialogProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={cn(
                            "relative w-full bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]",
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start p-6 border-b">
                            <div className="space-y-1 pr-6">
                                {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
                                {description && <p className="text-sm text-muted-foreground">{description}</p>}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-6 w-6 rounded-md p-0.5 text-muted-foreground hover:text-foreground absolute right-4 top-4"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end p-6 border-t bg-muted/40 gap-2">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
