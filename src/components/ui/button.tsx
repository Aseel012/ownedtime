import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-ink)] text-[var(--color-paper)] hover:opacity-90",
        ember: "bg-[var(--color-ember)] text-white hover:opacity-90",
        outline:
          "border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]",
        ghost: "bg-transparent hover:bg-[var(--color-paper-2)] text-[var(--color-ink)]",
        soft: "bg-[var(--color-paper-2)] text-[var(--color-ink)] hover:bg-[var(--color-line)]",
        link: "text-[var(--color-ember)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
