import React from "react";
import InfoHeader from "./UI/InfoHeader";
import InfoParagraph from "./UI/InfoParagraph";
import InfoLink from "./UI/InfoLink";

const AboutContent: React.FC = () => (
  <div className="flex-1 w-96 text-left space-y-4 text-sm">
    <InfoHeader>Who did this?</InfoHeader>
    <InfoParagraph>
      Hey! I&apos;m Jimmy, a developer, educator, and musician who loves mixing code, sound, and seeing what happens when you push things a bit too far.
    </InfoParagraph>
    <InfoParagraph>
      By day, I teach English and build web tools. By night (and sometimes by coffee break), I dive into music tech projects, like this clock, or <InfoLink href="https://annoying-piano.vercel.app/">this piano</InfoLink>.
    </InfoParagraph>
    <InfoParagraph>
      I spend way too much time figuring out how to make browsers do musical things they probably weren&apos;t meant to do. I&apos;m most excited by projects that exist at the intersection of &quot;oh that&apos;s interesting&quot; and &quot;OMG why would anyone make this?&quot;
    </InfoParagraph>
    <p className="text-center font-handwriting">
      <InfoLink href="https://jimmynicholas.com">jimmynicholas.com</InfoLink>
    </p>
  </div>
);

export default AboutContent; 