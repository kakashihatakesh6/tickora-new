"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative rounded-full w-9 h-9">
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme === "light" ? "light" : "dark"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center"
                >
                    {theme === "dark" ? (
                        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
                    ) : (
                        <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
                    )}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
