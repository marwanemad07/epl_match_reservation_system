import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

function Logo({ className }: LogoProps) {
  return (
    <img
      src="/Logo.png"
      alt="Logo"
      className={cn("w-full h-full", className)}
    />
  );
}

export default Logo;
