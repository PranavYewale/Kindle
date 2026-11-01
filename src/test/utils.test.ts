import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils & Formatter Suite", () => {
  it("merges class names correctly with tailwind-merge and clsx", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
    const falsyCondition = false;
    expect(cn("text-sm", falsyCondition && "text-lg", undefined, null, "font-bold")).toBe(
      "text-sm font-bold",
    );
  });

  it("handles complex conditional tailwind expressions without leaking falsy values", () => {
    const isPrimary = true;
    const isMuted = false;
    const result = cn("base-btn", isPrimary && "btn-primary", isMuted && "btn-muted");
    expect(result).toBe("base-btn btn-primary");
  });
});
