import fs from "node:fs";
import path from "node:path";
const tokens = fs.readFileSync(path.join(process.cwd(), "content", "tokens.css"), "utf-8");
const legal = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "legal.json"), "utf-8"));
const css = tokens + `
body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.65}
.lp{max-width:760px;margin:0 auto;padding:40px max(16px,env(safe-area-inset-left)) 80px}
.lp a.back{display:inline-block;margin-bottom:28px;color:var(--brass-text);text-decoration:none;font-weight:600}
.lp h3{font-family:var(--serif);font-weight:500;font-size:2.2rem;margin:0 0 16px}
.lp h4{margin:22px 0 4px;font-size:1.05rem}
.lp li,.lp p{font-size:1rem}
@media (prefers-color-scheme: dark){:root{--bg:#130F2A;--text:#F8EDDD;--muted:#BAB2CF;--brass-text:#F0A97A}}
`;
export default function LegalPage({ id }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="lp">
        <a className="back" href="/">← Retour au site D.M.M DECO</a>
        <div dangerouslySetInnerHTML={{ __html: legal[id] }} />
      </main>
    </>
  );
}
