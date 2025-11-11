"use client";
import Script from "next/script";

export default function MinePermitPage() {
  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-neutral-900">
      <h1 className="mb-2 text-center text-2xl font-bold">Form Mine Permit & SIMPER</h1>
      <div className="mb-2 flex items-center justify-center">
        <iframe
          data-tally-src="https://tally.so/embed/mOqMG7?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="85%"
          height="1600"
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
          title="PORTAL NPM"
        ></iframe>
        <Script
          id="tally-js"
          src="https://tally.so/widgets/embed.js"
          onLoad={() => Tally.loadEmbeds()}
          // Strategi yang baik untuk script pihak ketiga
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
