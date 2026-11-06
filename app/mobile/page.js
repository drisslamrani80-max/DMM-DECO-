import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

export const metadata = { robots: { index: false, follow: false } };
const read = (f) => fs.readFileSync(path.join(process.cwd(), "content", f), "utf-8");

export default function Mobile() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: read("mobile.css") }} />
      <div id="site-root" dangerouslySetInnerHTML={{ __html: read("mobile.html") }} />
      <Script src="/mobile.js" strategy="afterInteractive" />
    </>
  );
}
