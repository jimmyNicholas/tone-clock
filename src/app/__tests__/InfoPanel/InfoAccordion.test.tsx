import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoAccordion from "../../components/InfoPanel/InfoAccordion";
import { describe, it, expect } from "vitest";

describe("InfoAccordion", () => {
  const items = [
    { id: "one", title: "Section One", content: <div>First content</div> },
    { id: "two", title: "Section Two", content: <div>Second content</div> },
    { id: "three", title: "Section Three", content: <div>Third content</div> },
  ];

  it("renders all headers and only the default section open", () => {
    render(<InfoAccordion items={items} defaultOpen={1} />);
    items.forEach((item, idx) => {
      expect(screen.getByRole("button", { name: item.title })).toBeInTheDocument();
      if (idx === 1) {
        // Only the open panel is accessible by role
        const panel = screen.getByRole("region", { name: item.title });
        expect(panel).not.toHaveAttribute("aria-hidden", "true");
        expect(panel).toHaveTextContent(/second content/i);
      } else {
        // For closed panels, check by id and aria-hidden
        const panel = document.getElementById(`accordion-panel-${item.id}`);
        expect(panel).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  it("toggles sections on click", async () => {
    render(<InfoAccordion items={items} />);
    const user = userEvent.setup();
    const header = screen.getByRole("button", { name: /section two/i });
    await user.click(header);
    const panel = screen.getByRole("region", { name: /section two/i });
    expect(panel).not.toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveTextContent(/second content/i);
  });

  it("toggles sections with keyboard (Enter/Space)", async () => {
    render(<InfoAccordion items={items} />);
    const user = userEvent.setup();
    const header = screen.getByRole("button", { name: /section three/i });
    header.focus();
    await user.keyboard("{enter}");
    const panel = screen.getByRole("region", { name: /section three/i });
    expect(panel).not.toHaveAttribute("aria-hidden", "true");
    await user.keyboard(" ");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("navigates headers with arrow keys and Home/End", async () => {
    render(<InfoAccordion items={items} />);
    const user = userEvent.setup();
    const headers = items.map(item => screen.getByRole("button", { name: item.title }));
    headers[0].focus();
    await user.keyboard("{arrowdown}");
    expect(headers[1]).toHaveFocus();
    await user.keyboard("{arrowup}");
    expect(headers[0]).toHaveFocus();
    await user.keyboard("{end}");
    expect(headers[2]).toHaveFocus();
    await user.keyboard("{home}");
    expect(headers[0]).toHaveFocus();
  });

  it("has correct ARIA roles and attributes for all panels", async () => {
    render(<InfoAccordion items={items} />);
    const user = userEvent.setup();
    for (const item of items) {
      const header = screen.getByRole("button", { name: item.title });
      expect(header).toHaveAttribute("aria-controls");
      expect(header).toHaveAttribute("aria-expanded");
      expect(header).toHaveAttribute("id");
      await user.click(header);
      const panelId = header.getAttribute("aria-controls");
      const panel = document.getElementById(panelId!);
      expect(panel).toHaveAttribute("role", "region");
      expect(panel).toHaveAttribute("aria-labelledby", header.id);
      expect(panel).toHaveAttribute("id", panelId);
    }
  });
}); 