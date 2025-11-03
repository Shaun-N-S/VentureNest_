import React from "react"
import { cn } from "../../lib/utils"

type ChipProps = {
    selected: boolean
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
}

export default function Chip({ selected, children, onClick, disabled }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-accent",
                selected ? "bg-primary/10 text-primary border-primary" : "bg-card text-foreground border-border",
            )}
            aria-pressed={selected}
            aria-disabled={disabled}
        >
            {children}
        </button>
    )
}
