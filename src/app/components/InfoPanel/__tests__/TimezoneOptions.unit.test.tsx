import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimezoneOptions from "../TimezoneOptions";
import { describe, it, expect, vi } from "vitest";

describe("TimezoneOptions", () => {
  const onTimezoneChange = vi.fn();
  const currentTime = new Date("2023-01-01T12:34:56Z");

  const renderComponent = (selectedTimezone = 0) =>
    render(
      <TimezoneOptions
        selectedTimezone={selectedTimezone}
        onTimezoneChange={onTimezoneChange}
        currentTime={currentTime}
      />
    );

  it("renders current time in correct format", () => {
    renderComponent();
    expect(screen.getByText("Current Time")).toBeInTheDocument();
    const timeDiv = screen.getByTestId("current-time");
    expect(timeDiv.textContent).toContain(":");
  });

  it("renders all timezone options", () => {
    renderComponent();
    // There should be 25 options from -12 to +12
    expect(screen.getAllByRole("option")).toHaveLength(25);
    expect(screen.getByText(/GMT \+0 - London, Lisbon/)).toBeInTheDocument();
    expect(screen.getByText(/GMT \+12 - Auckland, Fiji/)).toBeInTheDocument();
    expect(screen.getByText(/GMT -12 - Baker Island, Howland Island/)).toBeInTheDocument();
  });

  it("calls onTimezoneChange when a new timezone is selected", () => {
    renderComponent();
    const select = screen.getByLabelText(/Select Timezone/);
    fireEvent.change(select, { target: { value: "5" } });
    expect(onTimezoneChange).toHaveBeenCalledWith(5);
  });

  it("selects the correct timezone option", () => {
    renderComponent(-8);
    const select = screen.getByLabelText(/Select Timezone/);
    expect(select).toHaveValue("-8");
  });

  it("has accessible label for the select element", () => {
    renderComponent();
    const select = screen.getByLabelText(/Select Timezone/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("id", "timezone-select");
  });

  it("is keyboard accessible (tab and arrow keys)", async () => {
    renderComponent();
    const user = userEvent.setup();
    const select = screen.getByLabelText(/Select Timezone/);
    select.focus();
    expect(select).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(select).toHaveFocus();
  });
}); 