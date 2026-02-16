'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentProcessing() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev; // Hold at 90% until complete
                return prev + Math.random() * 10;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
        >
            <div className="w-full max-w-md p-8 text-center space-y-8">
                {/* Icons Animation */}
                <div className="relative h-24 w-24 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"
                    />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center text-indigo-600"
                    >
                        <ShieldCheck className="h-10 w-10" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Processing Secure Payment
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                        Please do not close this window or refresh the page while we verify your transaction.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <span>Verifying</span>
                        <span>Confirming</span>
                        <span>Booking</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
