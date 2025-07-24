# Tone Clock

A musical clock web app that maps the current time to musical notes and intervals, allowing users to listen to the passage of time. Built with Next.js, React, and Tone.js.

---

## How to Use

- **What is it?**
  
  Tone Clock is an innovative audio timepiece that transforms the current time into a continuous musical soundscape. The app maps the positions of clock hands (hour and minute) to musical pitches, creating an ambient sonic representation of time that changes throughout the day.

- **How do I start the audio?**
  
  Click the **Enable Sound** button at the top of the interface to activate audio playback. This must be done due to browser autoplay restrictions—the app cannot start playing sound automatically.

- **What does the hour and minute toggle do?**
  
  Each of the four tones can be set to track either the hour hand or minute hand position on the clock. When set to "Hour," the tone's pitch changes based on the hour hand's position (completing a full cycle every 12 hours). When set to "Minute," the tone's pitch changes based on the minute hand's position (completing a full cycle every 60 minutes). This allows you to create complex harmonic relationships as different tones track different aspects of time.

- **How do I adjust the volume?**
  
  Each tone has its own volume slider (0-100%) allowing you to balance the four tones to create your desired mix. Use the speaker icons or drag the sliders to adjust individual tone volumes.

- **How do I adjust the pitch?**
  
  The + and - buttons adjust each tone's base pitch in semitones. This lets you set different tones to different musical intervals, creating harmonies and chord progressions that evolve with time. The display shows the offset from the base note (e.g., "+7 semitones" creates a perfect fifth interval).

- **How do I change the timezone?**
  
  Use the timezone dropdown to set your local time zone (GMT -12 to GMT +12), ensuring the musical representation accurately reflects your current local time.

---

## Architecture Overview
- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Component Structure:**
  - `Clock` (main container)
  - `ClockFace` (SVG clock with note labels)
  - `AudioControls`, `OptionControls`, `TimeDisplay`, `AppHeader`
- **Hooks:**
  - `useAudio` (manages Tone.js audio, effects, and state)
  - `useTime` (manages time, interval updates, and timezone)
- **Utils:**
  - Music theory helpers, audio effect chains, and value clamping
- **Testing:**
  - Vitest for unit and hook tests, with coverage reporting enabled

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
- **Accessibility:** All interactive elements have ARIA labels; SVG clock face is labeled for screen readers.
- **Performance:** Time updates every 100ms for smooth glissando; interval is configurable for future needs.
- **Audio Resource Management:** All Tone.js resources are disposed and refs nulled on unmount to prevent leaks.
- **Testing:** Focused on hooks and core logic, aiming for 80%+ coverage.
- **No Global State Manager:** Context/state manager omitted for simplicity, as the app is small and prop drilling is minimal.

---
