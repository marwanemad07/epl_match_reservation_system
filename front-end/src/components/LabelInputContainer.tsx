import { cn } from "@/lib/utils";

type LabelInputContainerProps = {
  children: React.ReactNode;
  className?: string;
  error?: string;
};

const LabelInputContainer = ({
  children,
  className,
  error,
}: LabelInputContainerProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
      <p className="text-sm text-destructive-foreground mt-1">{error}</p>
    </div>
  );
};

export default LabelInputContainer;
