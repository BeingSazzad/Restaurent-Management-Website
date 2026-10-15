import React from 'react';

const RIBBON_WORDS = [
  'Origin',
  'Spice',
  'Aroma',
  'Texture',
  'Taste',
  'Craft',
  'Gathering',
  'Celebration',
  'Heritage',
  'Tradition',
];

export const MarqueeRibbon: React.FC = () => {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-[#7E2D10]/25 select-none shadow-[0_2px_12px_rgba(184,74,34,0.12)] z-20"
      style={{
        background:
          'linear-gradient(90deg, #8E3414 0%, #B84A22 25%, #E27227 50%, #B84A22 75%, #8E3414 100%)',
      }}
      aria-label="Amber Spice Brand Essence Ticker"
    >
      {/* Subtle edge vignetting for smooth infinite entry/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#8E3414] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#8E3414] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track (Continuous hardware-accelerated seamless infinite loop) */}
      <div className="animate-marquee-infinite py-3.5 sm:py-4 flex items-center">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {RIBBON_WORDS.map((word, idx) => (
            <div key={`w1-${idx}`} className="flex items-center">
              <span className="text-white text-[16px] sm:text-[17px] font-bold tracking-wide whitespace-nowrap">
                {word}
              </span>
              <span className="mx-10 sm:mx-14 md:mx-16 text-[#FEE49A] text-[20px] sm:text-[22px] md:text-[24px] shrink-0 select-none leading-none">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 2 (Identical clone for seamless loop) */}
        <div className="flex items-center shrink-0">
          {RIBBON_WORDS.map((word, idx) => (
            <div key={`w2-${idx}`} className="flex items-center">
              <span className="text-white text-[16px] sm:text-[17px] font-bold tracking-wide whitespace-nowrap">
                {word}
              </span>
              <span className="mx-10 sm:mx-14 md:mx-16 text-[#FEE49A] text-[20px] sm:text-[22px] md:text-[24px] shrink-0 select-none leading-none">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
