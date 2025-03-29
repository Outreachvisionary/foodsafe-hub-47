import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Label component variants using CVA
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        small: "text-xs",
        large: "text-base"
      },
      weight: {
        default: "font-medium",
        normal: "font-normal",
        bold: "font-bold"
      },
      required: {
        true: "after:content-['*'] after:text-red-500 after:ml-0.5"
      }
    },
    defaultVariants: {
      size: "default",
      weight: "default"
    }
  }
)

/**
 * Label component that extends Radix UI's label primitive 
 * with additional styling options
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, size, weight, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ size, weight, required }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
