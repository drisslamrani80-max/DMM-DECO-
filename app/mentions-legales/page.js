import legal from "../../content/legal.json";
export const metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };
export default function Page() { return <section className="sec"><div className="wrap prose" dangerouslySetInnerHTML={{ __html: legal["lg-mentions"] }} /></section>; }
