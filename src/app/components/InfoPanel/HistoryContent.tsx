import React from "react";
import InfoHeader from "./UI/InfoHeader";
import InfoParagraph from "./UI/InfoParagraph";
import InfoLink from "./UI/InfoLink";

const HistoryContent: React.FC = () => (
  <div className="flex-1 w-96 text-left space-y-4 text-sm">
    <InfoHeader>History</InfoHeader>
    <InfoParagraph>
      It all started with <InfoLink href="https://imgur.com/finished-FYkaAJK">this picture</InfoLink> from a <InfoLink href="https://www.reddit.com/r/piano/comments/2ox632/i_made_a_circle_of_fifths_clock_you_may/">Reddit post</InfoLink> that caught my eye. Someone had made a circle of fifths clock - a timepiece where each hour corresponded to a different musical key. As I looked at it, one thought kept nagging at me: what would this actually sound like?
    </InfoParagraph>
    <InfoParagraph>
      I started experimenting with <InfoLink href="https://www.ableton.com/en/live/what-is-live/">Ableton</InfoLink>. I mapped some synthesizers to follow the clock hands, with the minute hand using <InfoLink href="https://en.wikipedia.org/wiki/Portamento">portamento</InfoLink> - a smooth sliding effect between notes. For the hour markers and five-minute intervals, I set up some chords that would trigger at specific times.
    </InfoParagraph>
    <InfoParagraph>
      There were some annoying problems though. Ableton had limitations on how long tracks could be, making a full 12-hour piece tricky. The second hand made everything sound chaotic. The hour chords would only trigger once per hour, so to actually hear them, you&apos;d have to start the track from the beginning and wait around. And once everything was rendered into an audio file, that was it - no way to tweak anything.
    </InfoParagraph>
    <InfoParagraph>
      I did what I could, condensing the whole 12-hour idea down to 12 minutes and putting it on <InfoLink href="https://soundcloud.com/jimmy_nicholas/musicical-clock">SoundCloud</InfoLink>. Then I pretty much forgot about it for ten years.
    </InfoParagraph>
    <InfoParagraph>
      Eventually I learned to code and built another musical thing using the <InfoLink href="https://tonejs.github.io/">Tone.js library</InfoLink> - which got me thinking about that old clock project again.
    </InfoParagraph>
    <InfoParagraph>
      This time around, I could actually fix those old problems. The website just takes the current time and maps where the hands are pointing to different frequencies in real-time. Since it updates constantly, the sound never stops, and you can fiddle with all the settings while it&apos;s playing.
    </InfoParagraph>
    <InfoParagraph>
      That&apos;s how a random Reddit picture from a decade ago turned into a pointless website. I have no idea what to do with it now but if you do, please yell at me and I might be able to help. Coffee and a quieter voice will improve your chances.
    </InfoParagraph>
  </div>
);

export default HistoryContent; 