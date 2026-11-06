import { NextResponse } from "next/server";

// Les téléphones reçoivent la version mobile (adresse inchangée) ; les robots (Google…) voient toujours la version principale.
export function middleware(req) {
  const ua = req.headers.get("user-agent") || "";
  const isPhone = /Android|iPhone|iPod|Mobi/i.test(ua) && !/bot|google|crawl|spider|slurp|bing/i.test(ua);
  const res = isPhone ? NextResponse.rewrite(new URL("/mobile", req.url)) : NextResponse.next();
  res.headers.set("Vary", "User-Agent");
  return res;
}
export const config = { matcher: ["/"] };
