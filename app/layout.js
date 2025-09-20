import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portal NPM",
  description: "Portal NPM with Next.js",
   icons: {
    icon: "/Logo Npm Bundar-01.png", // ganti sesuai nama file di /public
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}
        {/* Script loader Tally */}
        <Script id="tally-embed" strategy="afterInteractive">
          {`
            var d=document,w="https://tally.so/widgets/embed.js",v=function(){
              if(typeof Tally!=="undefined"){Tally.loadEmbeds();}
              else{
                d.querySelectorAll("iframe[data-tally-src]:not([src])")
                  .forEach(function(e){e.src=e.dataset.tallySrc});
              }
            };
            if(typeof Tally!=="undefined")v();
            else if(d.querySelector('script[src="'+w+'"]')==null){
              var s=d.createElement("script");
              s.src=w;
              s.onload=v;
              s.onerror=v;
              d.body.appendChild(s);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
