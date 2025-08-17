import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary gradient button - our hero button
        primary: "bg-gradient-primary text-text-primary font-semibold shadow-design-md hover:shadow-design-glow hover:scale-[1.02] active:scale-[0.98] active:shadow-design-sm transition-all duration-fast",
        
        // Secondary glass effect
        secondary: "glass-card text-text-secondary hover:text-text-primary hover:bg-hover-overlay border-border-primary hover:border-border-accent/50",
        
        // Ghost minimal button
        ghost: "text-text-secondary hover:text-text-primary hover:bg-hover-overlay",
        
        // Outline with gradient border
        outline: "border border-border-primary text-text-secondary hover:text-text-primary hover:bg-hover-overlay hover:border-border-accent/50 bg-transparent",
        
        // Gradient outline - special variant
        "gradient-outline": "border-2 border-transparent bg-gradient-primary bg-clip-padding text-text-primary relative before:absolute before:inset-0 before:bg-bg-primary before:rounded-[inherit] before:-z-10 hover:before:bg-hover-overlay",
        
        // Success state
        success: "bg-accent-success text-text-primary hover:opacity-90",
        
        // Destructive state
        destructive: "bg-accent-error text-text-primary hover:opacity-90",
        
        // Link style
        link: "text-accent-purple underline-offset-4 hover:underline p-0 h-auto font-normal",
        
        // Hero landing button
        hero: "bg-gradient-primary text-text-primary font-bold text-base px-8 py-4 rounded-xl shadow-design-xl hover:shadow-design-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-normal",
        
        // Minimal elevated
        elevated: "bg-bg-secondary text-text-primary shadow-design-md hover:shadow-design-lg hover:bg-bg-tertiary transition-all duration-normal",
        
        // Premium upgrade button
        premium: "bg-gradient-primary text-text-primary font-semibold shadow-design-md hover:shadow-design-glow hover:scale-[1.02] active:scale-[0.98] border border-border-accent/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
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