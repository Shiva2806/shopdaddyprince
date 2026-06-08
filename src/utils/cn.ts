// Utility to merge Tailwind class names conditionally
// Usage: cn("base-class", condition && "conditional-class", "always-class")
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
