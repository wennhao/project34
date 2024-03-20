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
          <div className="absolute top-0 left-0">
            {/* Image in the top left corner */}
            <img src="/wing.png" alt="ChitChat Logo" className="h-max w-max" />
            {/* Horizontal bar underneath */}
            <div className="w-screen h-7 bg-CamoGreen"></div>
          </div>


          {/* Layout UI */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
