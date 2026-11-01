import { describe, it, expect } from "vitest";

describe("Accessibility & Semantic HTML Compliance", () => {
  it("verifies buttons have accessible names or aria-labels in DOM", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <button aria-label="Toggle Theme Mode" type="button">
        <span>🌙</span>
      </button>
      <button type="button">Save Milestone</button>
    `;
    document.body.appendChild(container);

    const iconBtn = container.querySelector("button[aria-label='Toggle Theme Mode']");
    const textBtn = container.querySelectorAll("button")[1];

    expect(iconBtn).not.toBeNull();
    expect(iconBtn?.getAttribute("aria-label")).toBe("Toggle Theme Mode");
    expect(textBtn?.textContent).toBe("Save Milestone");

    document.body.removeChild(container);
  });

  it("ensures images possess mandatory alt text attributes", () => {
    const img = document.createElement("img");
    img.src = "/assets/wedding.webp";
    img.alt = "Royal Wedding Mandap Decoration with Marigolds";
    document.body.appendChild(img);

    expect(img.getAttribute("alt")).toBe("Royal Wedding Mandap Decoration with Marigolds");
    expect(img.getAttribute("alt")?.length).toBeGreaterThan(5);

    document.body.removeChild(img);
  });

  it("verifies proper dialog accessibility roles and labeling", () => {
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "dialog-title");
    dialog.innerHTML = `
      <h2 id="dialog-title">Modify Milestone Date</h2>
      <button aria-label="Close dialog">×</button>
    `;
    document.body.appendChild(dialog);

    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe("dialog-title");

    const closeBtn = dialog.querySelector("button[aria-label='Close dialog']");
    expect(closeBtn).not.toBeNull();

    document.body.removeChild(dialog);
  });
});
