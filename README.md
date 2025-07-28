# Tone Clock

A musical clock web app that maps the current time to musical notes and intervals, allowing users to listen to the passage of time. Built with Next.js, React, and Tone.js.

---

## How to Use

- **What is it?**
  
  Tone Clock is an innovative audio timepiece that transforms the current time into a continuous musical soundscape. The app maps the positions of clock hands (hour and minute) to musical pitches, creating an ambient sonic representation of time that changes throughout the day.

- **How do I start the audio?**
  
  Click the **clock face area** (with the frosted overlay) to enable sound. Due to browser autoplay restrictions, the app cannot start playing sound automatically. When sound is disabled, a frosted overlay with "Sound Disabled" and "Click to enable" is shown. Once enabled, the overlay disappears and the clock is interactive.

- **What does the hour and minute toggle do?**
  
  Each of the four tones can be set to track either the hour hand or minute hand position on the clock. When set to "Hour," the tone's pitch changes based on the hour hand's position (completing a full cycle every 12 hours). When set to "Minute," the tone's pitch changes based on the minute hand's position (completing a full cycle every 60 minutes). This allows you to create complex harmonic relationships as different tones track different aspects of time.

- **How do I adjust the volume?**
  
  Each tone has its own volume slider (0-100%) allowing you to balance the four tones to create your desired mix. Use the sliders to adjust individual tone volumes.

- **How do I adjust the pitch?**
  
  Use the interval slider or quick interval buttons (e.g., +12, -12) to adjust each tone's base pitch in semitones. This lets you set different tones to different musical intervals, creating harmonies and chord progressions that evolve with time. The display shows the offset from the base note (e.g., "+7 st" creates a perfect fifth interval).

- **How do I change the timezone?**
  
  Use the timezone dropdown in the "Timezone" tab to set your local time zone (GMT -12 to GMT +12), ensuring the musical representation accurately reflects your current local time.

---

## Architecture Overview
- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Component Structure:**
  - `AppHeader` (top bar)
  - `ClockFace` (SVG clock with note labels)
  - `AudioControls` (wraps the clock face, handles enable/disable overlay)
  - `TabbedPanel` (main options panel)
  - `AudioOptions` (tone controls: hand, volume, interval)
  - `TimezoneOptions` (timezone selection)
  - `InstructionsContent`, `AboutContent`, `HistoryContent` (info tabs)
  - `InfoPanel/UI/*` (accordion, links, etc)
- **Hooks:**
  - `useAudio` (manages Tone.js audio, effects, and state)
  - `useTime` (manages time, interval updates, and timezone)
- **Utils:**
  - Music theory helpers, audio effect chains, and value clamping
- **Testing:**
  - Vitest for unit and accessibility (a11y) tests
  - Tests for all major components and hooks, including `AudioOptions`, `TimezoneOptions`, and accessibility overlays

## Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Run tests and check coverage:**
   ```bash
   npx vitest run --coverage
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## Key Design Decisions
- **Hooks & State:** Custom hooks (`useAudio`, `useTime`) encapsulate logic for reusability and separation of concerns.
- **TypeScript:** Strict typing throughout, including explicit generics for all state and props.
- **Accessibility:** All interactive elements have ARIA labels; overlays and controls are keyboard accessible and screen reader friendly.
- **Performance:** Time updates every 100ms for smooth glissando; interval is configurable for future needs.
- **Audio Resource Management:** All Tone.js resources are disposed and refs nulled on unmount to prevent leaks.
- **Testing:** Focused on hooks and all major UI, with both unit and a11y coverage for core controls and options.
- **No Global State Manager:** Context/state manager omitted for simplicity, as the app is small and prop drilling is minimal.

---
