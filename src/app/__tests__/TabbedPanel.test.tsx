import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabbedPanel from "../components/TabbedPanel";
import { describe, it, expect, vi } from "vitest";

let currentTab: string | null = null;
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn((url) => {
      // Simulate updating the query string
      const match = /\?tab=([^&]+)/.exec(url);
      currentTab = match ? match[1] : null;
    }),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => currentTab),
    entries: vi.fn(() => (currentTab ? [["tab", currentTab]] : [])),
  }),
}));

// Dummy OptionControls for children
const DummyOptions = () => <div data-testid="options-content">Options Content</div>;

describe("TabbedPanel", () => {
  it("renders all tabs and the default panel", () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /options/i })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.getByTestId("options-content")).toBeInTheDocument();
  });

  it("switches tabs on click and updates panel", async () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const instructionsTab = screen.getByRole("tab", { name: /instructions/i });
    await user.click(instructionsTab);
    await waitFor(() => {
      const panels = screen.getAllByRole("tabpanel");
      const visiblePanel = panels.find(panel => !panel.hasAttribute("hidden"));
      expect(visiblePanel).toHaveTextContent(/what is it\?/i);
      expect(instructionsTab).toHaveAttribute("aria-selected", "true");
    });
  });

  it("switches tabs with arrow keys and Home/End", async () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{arrowright}");
    expect(tabs[1]).toHaveFocus();
    await user.keyboard("{arrowleft}");
    expect(tabs[0]).toHaveFocus();
    await user.keyboard("{end}");
    expect(tabs[tabs.length - 1]).toHaveFocus();
    await user.keyboard("{home}");
    expect(tabs[0]).toHaveFocus();
  });

  it("has correct ARIA roles and attributes", () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute("aria-controls");
      expect(tab).toHaveAttribute("aria-selected");
      expect(tab).toHaveAttribute("id");
    });
    const panels = screen.getAllByRole("tabpanel");
    panels.forEach(panel => {
      expect(panel).toHaveAttribute("aria-labelledby");
      expect(panel).toHaveAttribute("id");
    });
  });

  it("moves focus to the first tab on mount", () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveFocus();
  });

  it("updates the ARIA live region on tab change", async () => {
    const { container } = render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const instructionsTab = screen.getByRole("tab", { name: /instructions/i });
    await user.click(instructionsTab);
    await waitFor(() => {
      const liveRegion = container.querySelector('div[aria-live="polite"]');
      expect(liveRegion?.textContent).toMatch(/instructions tab selected/i);
    }, { timeout: 1000 });
  });

  it("updates the ARIA live region on tab change (History tab)", async () => {
    const { container } = render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const historyTab = screen.getByRole("tab", { name: /history/i });
    await user.click(historyTab);
    await waitFor(() => {
      const liveRegion = container.querySelector('div[aria-live="polite"]');
      expect(liveRegion?.textContent).toMatch(/history tab selected/i);
    }, { timeout: 1000 });
  });

  it("updates the ARIA live region on tab change (Who did this? tab)", async () => {
    const { container } = render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const aboutTab = screen.getByRole("tab", { name: /who did this/i });
    await user.click(aboutTab);
    await waitFor(() => {
      const liveRegion = container.querySelector('div[aria-live="polite"]');
      expect(liveRegion?.textContent).toMatch(/who did this\? tab selected/i);
    }, { timeout: 1000 });
  });

  it("falls back to Options tab if query string is invalid", async () => {
    // Simulate an invalid tab slug
    currentTab = "notarealtab";
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const optionsTab = screen.getByRole("tab", { name: /options/i });
    expect(optionsTab).toHaveAttribute("aria-selected", "true");
    const panels = screen.getAllByRole("tabpanel");
    const visiblePanel = panels.find(panel => !panel.hasAttribute("hidden"));
    expect(visiblePanel).toHaveTextContent(/options content/i);
  });

  it("shows correct tab if query string is valid", async () => {
    // Simulate a valid tab slug
    currentTab = "history";
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const historyTab = screen.getByRole("tab", { name: /history/i });
    expect(historyTab).toHaveAttribute("aria-selected", "true");
    const panels = screen.getAllByRole("tabpanel");
    const visiblePanel = panels.find(panel => !panel.hasAttribute("hidden"));
    expect(visiblePanel).toHaveTextContent(/history/i);
  });

  it("wraps keyboard navigation from last to first tab and vice versa", async () => {
    render(<TabbedPanel><DummyOptions /></TabbedPanel>);
    const user = userEvent.setup();
    const tabs = screen.getAllByRole("tab");
    tabs[tabs.length - 1].focus();
    await user.keyboard("{arrowright}");
    expect(tabs[0]).toHaveFocus();
    tabs[0].focus();
    await user.keyboard("{arrowleft}");
    expect(tabs[tabs.length - 1]).toHaveFocus();
  });
}); 