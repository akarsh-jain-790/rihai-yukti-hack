import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg border p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle: React.FC<{ className?: string }> = ({
  className,
  children,
}) => <h5 className={`font-semibold text-lg ${className}`}>{children}</h5>;

const AlertDescription: React.FC<{ className?: string }> = ({
  className,
  children,
}) => <p className={`text-sm ${className}`}>{children}</p>;

export { Alert, AlertTitle, AlertDescription };
