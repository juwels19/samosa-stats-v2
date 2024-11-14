import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border border-zinc-200 p-4 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:size-5 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-zinc-950 dark:border-zinc-800 dark:[&>svg]:text-zinc-50",
  {
    variants: {
      variant: {
        default: "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50",
        info: "border-blue-500/50 dark:border-blue-500 [&>svg]:text-blue-500 dark:border-blue-950/50 dark:border-blue-900 dark:[&>svg]:text-blue-500 bg-blue-100 dark:bg-blue-950/50",
        warning:
          "border-orange-500/50 dark:border-orange-500 [&>svg]:text-orange-500 dark:border-orange-900/50 dark:border-orange-900 dark:[&>svg]:text-orange-500 bg-orange-100 dark:bg-orange-950/50",
        destructive:
          "border-red-500/50 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:border-red-900 dark:[&>svg]:text-red-500 bg-red-100 dark:bg-red-950/50",
        success:
          "border-green-500/50 dark:border-green-500 [&>svg]:text-green-500 dark:border-green-900/50 dark:border-green-900 dark:[&>svg]:text-green-500 bg-green-100 dark:bg-green-950/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
