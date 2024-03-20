import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "WING",
  description: "WING ATM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <div className="App">
          {/* Container for image and bar, aligned to the top left of the viewport */}
          <div className="absolute top-2 left-0">
            {/* Image in the top left corner */}
            <img src="/wingiconbig.png" alt="Logo Wing" className="h-1/6 w-1/6 mb-3 ml-7 mt-2" />
            {/* Horizontal bar underneath */}
            <div className="w-screen h-3 bg-camogreen"></div>
          </div>


          {/* Layout UI */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
