import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  hasName?: boolean;
};

/**
 * Logo renders the logo of the application with/without application name.
 */
function Logo({ className, hasName = false }: LogoProps) {
  return (
    <>
      {hasName ? (
        <img
          src="/LogoTitle.png"
          alt="Logo"
          className={cn("w-full h-full", className)}
        />
      ) : (
        <img
          src="/Logo.png"
          alt="Logo"
          className={cn("w-full h-full", className)}
        />
      )}
    </>
  );
}

export default Logo;
