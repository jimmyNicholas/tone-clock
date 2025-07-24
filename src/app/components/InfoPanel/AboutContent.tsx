import React from "react";

const AboutContent: React.FC = () => (
  <div className="flex-1 w-96 text-left space-y-4 text-sm">
    <h2 className="font-semibold mb-2 text-center">Who did this?</h2>
    <p>
      Hey! I&apos;m Jimmy, a developer, educator, and musician who gets a kick out of mixing code, sound, and seeing what happens when you push things a bit too far.
    </p>
    <p>
      By day, I teach English and build web tools. By night (and sometimes by coffee break), I dive into music tech projects—like this clock, or <a href="https://annoying-piano.vercel.app/">this piano</a>.
    </p>
    <p>
      I spend way too much time figuring out how to make browsers do musical things they probably weren&apos;t meant to do. I&apos;m most excited by projects that exist at the intersection of &quot;oh that&apos;s interesting&quot; and &quot;OMG why would anyone make this?&quot;
    </p>
    <p className="text-center">
      <a href="https://jimmynicholas.com">jimmynicholas.com</a>
    </p>
  </div>
);

export default AboutContent; 