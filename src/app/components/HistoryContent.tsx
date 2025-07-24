import React from "react";

interface LinkWithTooltipProps {
  href: string;
  children: React.ReactNode;
}

const LinkWithTooltip: React.FC<LinkWithTooltipProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
    title={href}
  >
    {children}
  </a>
);

const HistoryContent: React.FC = () => (
  <div className="flex-1 w-96 text-left space-y-4 text-sm">
    <h2 className="font-semibold mb-2 text-center">History</h2>
    <p>
      It all started with <LinkWithTooltip href="https://imgur.com/finished-FYkaAJK">this picture</LinkWithTooltip> from a <LinkWithTooltip href="https://www.reddit.com/r/piano/comments/2ox632/i_made_a_circle_of_fifths_clock_you_may/">Reddit post</LinkWithTooltip> that caught my eye. Someone had made a clock where each hour corresponded to a different musical key around the <LinkWithTooltip href="https://en.wikipedia.org/wiki/Circle_of_fifths">circle of fifths</LinkWithTooltip>. As I looked at it, one thought kept nagging at me: what would this actually sound like?
    </p>
    <p>
      I started experimenting with <LinkWithTooltip href="https://www.ableton.com/en/live/what-is-live/">Ableton</LinkWithTooltip>. I mapped some synthesizers to follow the clock hands, with the minute hand using <LinkWithTooltip href="https://en.wikipedia.org/wiki/Portamento">portamento</LinkWithTooltip> for smooth sliding between notes. For the hour markers and five-minute intervals, I set up some chords that would trigger at specific times.
    </p>
    <p>
      There were some annoying problems though. Ableton had limitations on how long tracks could be, making a full 12-hour piece tricky. The second hand made everything sound chaotic. The hour chords would only trigger once per hour, so to actually hear them, you&apos;d have to start the track from the beginning and wait around. And once everything was rendered into an audio file, that was it! No way to tweak anything!
    </p>
    <p>
      I did what I could, condensing the whole 12-hour idea down to 12 minutes and putting it on <LinkWithTooltip href="https://soundcloud.com/jimmy_nicholas/musicical-clock">SoundCloud</LinkWithTooltip>. Then I pretty much forgot about it for ten years.
    </p>
    <p>
      Eventually I learned to code and built <LinkWithTooltip href="https://annoying-piano.vercel.app/">a piano that changes as you play</LinkWithTooltip> using the <LinkWithTooltip href="https://tonejs.github.io/">Tone.js library</LinkWithTooltip> which got me thinking about that old clock project again.
    </p>
    <p>
      This time around, I could actually fix those old stupid problems. The website just takes the current time and maps where the hands are pointing to different frequencies in real-time. Since it updates constantly, the sound never stops, and you can fiddle with all the settings while it&apos;s playing.
    </p>
    <p>
      That&apos;s how a random Reddit picture from a decade ago turned into a pointless website. I have no idea what to do with it now but if you do, please yell at me and I might be able to help. Coffee and a quieter voice will improve your chances.
    </p>
  </div>
);

export default HistoryContent; 