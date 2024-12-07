import { cn } from "@/lib/utils";

type LabelInputContainerProps = {
  children: React.ReactNode;
  className?: string;
  error?: string;
};

/**
 * LabelInputContainer renders a label with an input with spacing and error message if needed
 * @param props holds the data needed for the component
 *              - **children:** should hold the input components
 *              - **error:** optional parameter to display the error message
 *              - **className:** optional parameter to customize the component
 */
const LabelInputContainer = ({
  children,
  className,
  error,
}: LabelInputContainerProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
      <p className="text-sm text-destructive mt-1">{error}</p>
    </div>
  );
};

export default LabelInputContainer;
