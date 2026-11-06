import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

const read = (f) => fs.readFileSync(path.join(process.cwd(), "content", f), "utf-8");

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: read("main.css") }} />
      <div id="site-root" dangerouslySetInnerHTML={{ __html: read("main.html") }} />
      <Script src="/main.js" strategy="afterInteractive" />
    </>
  );
}
