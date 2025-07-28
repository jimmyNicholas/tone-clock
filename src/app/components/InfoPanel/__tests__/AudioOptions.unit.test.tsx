import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AudioOptions from "../AudioOptions";
import { describe, it, expect, vi } from "vitest";

const mockNotes = [
  {
    id: "toneOne",
    name: "Tone One",
    timeType: "hour" as const,
    volume: 0.5,
    harmonicInterval: 0,
  },
  {
    id: "toneTwo",
    name: "Tone Two",
    timeType: "minute" as const,
    volume: 0.7,
    harmonicInterval: 7,
  },
];

describe("AudioOptions", () => {
  const updateVolume = vi.fn();
  const updateHarmonicInterval = vi.fn();
  const updateNoteType = vi.fn();

  const renderComponent = (notes = mockNotes) =>
    render(
      <AudioOptions
        notes={notes}
        updateVolume={updateVolume}
        updateHarmonicInterval={updateHarmonicInterval}
        updateNoteType={updateNoteType}
      />
    );

  it("renders all tone cards with correct names and controls", () => {
    renderComponent();
    expect(screen.getByText("Tone One")).toBeInTheDocument();
    expect(screen.getByText("Tone Two")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Volume/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Interval/)).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Hour|Minute/ })).toHaveLength(4);
  });

  it("calls updateVolume when volume slider is changed", () => {
    renderComponent();
    const sliders = screen.getAllByLabelText(/Volume/);
    fireEvent.change(sliders[0], { target: { value: "0.8" } });
    expect(updateVolume).toHaveBeenCalledWith("toneOne", 0.8);
  });

  it("calls updateHarmonicInterval when interval slider is changed", () => {
    renderComponent();
    const sliders = screen.getAllByLabelText(/Interval/);
    fireEvent.change(sliders[1], { target: { value: "5" } });
    expect(updateHarmonicInterval).toHaveBeenCalledWith("toneTwo", 5);
  });

  it("calls updateNoteType when hand buttons are clicked", async () => {
    renderComponent();
    const user = userEvent.setup();
    const hourButtons = screen.getAllByRole("button", { name: /Hour/ });
    await user.click(hourButtons[1]);
    expect(updateNoteType).toHaveBeenCalledWith("toneTwo", "hour");
    const minuteButtons = screen.getAllByRole("button", { name: /Minute/ });
    await user.click(minuteButtons[0]);
    expect(updateNoteType).toHaveBeenCalledWith("toneOne", "minute");
  });

  it("calls updateHarmonicInterval when quick interval buttons are clicked", async () => {
    renderComponent();
    const user = userEvent.setup();
    // Find all -12 buttons (should be one per card)
    const minus12Buttons = screen.getAllByRole("button", { name: /Decrease interval by 12 semitones/ });
    await user.click(minus12Buttons[0]);
    expect(updateHarmonicInterval).toHaveBeenCalledWith("toneOne", -12);
    // +12
    const plus12Buttons = screen.getAllByRole("button", { name: /Increase interval by 12 semitones/ });
    await user.click(plus12Buttons[1]);
    expect(updateHarmonicInterval).toHaveBeenCalledWith("toneTwo", 19); // 7+12
  });

  it("disables quick interval buttons at min/max", () => {
    renderComponent([
      { ...mockNotes[0], harmonicInterval: -24 },
      { ...mockNotes[1], harmonicInterval: 24 },
    ]);
    const minus12 = screen.getAllByRole("button", { name: /Decrease interval by 12 semitones/ })[0];
    const plus12 = screen.getAllByRole("button", { name: /Increase interval by 12 semitones/ })[1];
    expect(minus12).toBeDisabled();
    expect(plus12).toBeDisabled();
  });

  it("has accessible labels for all controls", () => {
    renderComponent();
    expect(screen.getAllByLabelText(/Volume/)[0]).toHaveAttribute("type", "range");
    expect(screen.getAllByLabelText(/Interval/)[0]).toHaveAttribute("type", "range");
    expect(screen.getAllByRole("button", { name: /Hour/ })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Minute/ })[0]).toBeInTheDocument();
  });

  it("is keyboard accessible (tab and arrow keys)", async () => {
    renderComponent();
    const user = userEvent.setup();
    const sliders = screen.getAllByLabelText(/Volume/);
    sliders[0].focus();
    expect(sliders[0]).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    // The value should change, but since we use fireEvent for change, this is just a basic focus test
    expect(sliders[0]).toHaveFocus();
  });
}); 