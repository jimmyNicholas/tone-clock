# Tone Clock

A musical clock web app that maps the current time to musical notes and intervals, allowing users to listen to the passage of time. Built with Next.js, React, and Tone.js.

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
