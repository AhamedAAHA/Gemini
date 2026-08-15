import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em]">
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split("\n");
  const out: ReactNode[] = [];
  let list: string[] | null = null;

  const flush = (key: string) => {
    if (list) {
      out.push(
        <ul key={key} className="my-1.5 space-y-0.5 pl-5">
          {list.map((item, i) => (
            <li key={i} className="list-disc">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  lines.forEach((line, i) => {
    const m = line.match(/^(\d+\.|-)\s+(.*)$/);
    if (m) {
      if (!list) list = [];
      list.push(m[2]);
      return;
    }
    flush(`ul-${i}`);
    if (line.trim() === "") return;
    out.push(<p key={`p-${i}`}>{renderInline(line)}</p>);
  });
  flush("ul-end");
  return out;
}
