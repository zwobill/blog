/**
 * Turn an MDX post body into prose for /llms-full.txt.
 * Drops import/export lines and MDX/JSX component chrome, keeps readable text.
 */
const COMPONENT_NAMES = [
  'KeyTakeaways',
  'Figure',
  'Callout',
  'FAQ',
  'Quote',
  'CodeBlock',
  'Video',
  'YouTube',
] as const;

const DROP_WHOLE = new Set<string>(['KeyTakeaways', 'YouTube', 'Video']);

const NAME_PATTERN = COMPONENT_NAMES.join('|');
const START_RE = new RegExp(`<(${NAME_PATTERN})(?=[\\s>/])`);

function stripImportExports(source: string): string {
  return source.replace(/^(?:import|export)\s[\s\S]*?;[ \t]*\n?/gm, '');
}

function readQuoted(source: string, start: number): number {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  return source.length;
}

function findOpenTagEnd(source: string, nameStart: number): { end: number; selfClosing: boolean } | null {
  // nameStart points at '<'
  let i = nameStart;
  let braceDepth = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      i = readQuoted(source, i);
      continue;
    }
    if (ch === '{') {
      braceDepth += 1;
      i += 1;
      continue;
    }
    if (ch === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      i += 1;
      continue;
    }
    if (braceDepth === 0 && ch === '/' && source[i + 1] === '>') {
      return { end: i + 2, selfClosing: true };
    }
    if (braceDepth === 0 && ch === '>') {
      return { end: i + 1, selfClosing: false };
    }
    i += 1;
  }
  return null;
}

function findCloseTagEnd(source: string, from: number, name: string): number | null {
  const close = `</${name}>`;
  const idx = source.indexOf(close, from);
  if (idx === -1) return null;
  return idx + close.length;
}

function attrValue(tag: string, attr: string): string | null {
  const re = new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`);
  const m = tag.match(re);
  return m ? (m[1] ?? m[2] ?? null) : null;
}

function formatFaq(tag: string): string {
  const pairs = [...tag.matchAll(/question:\s*"((?:\\.|[^"\\])*)"[\s\S]*?answer:\s*"((?:\\.|[^"\\])*)"/g)];
  if (pairs.length === 0) return '';
  return pairs
    .map(([, q, a]) => `Q: ${q.replace(/\\"/g, '"')}\nA: ${a.replace(/\\"/g, '"')}`)
    .join('\n\n');
}

function unwrapTemplateExpression(inner: string): string {
  const trimmed = inner.trim();
  const fence = trimmed.match(/^\{`([\s\S]*?)`\}$/);
  if (fence) return fence[1];
  return inner;
}

function replaceHtml(text: string): string {
  return text
    .replace(/<\/?strong>/gi, '**')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
}

function replaceComponents(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const slice = source.slice(i);
    const m = START_RE.exec(slice);
    if (!m || m.index === undefined) {
      out += slice;
      break;
    }
    const abs = i + m.index;
    out += source.slice(i, abs);
    const name = m[1];
    const open = findOpenTagEnd(source, abs);
    if (!open) {
      out += source[abs];
      i = abs + 1;
      continue;
    }
    let end = open.end;
    let inner = '';
    const openTag = source.slice(abs, open.end);
    if (!open.selfClosing) {
      const closeEnd = findCloseTagEnd(source, open.end, name);
      if (closeEnd === null) {
        out += source[abs];
        i = abs + 1;
        continue;
      }
      inner = source.slice(open.end, closeEnd - `</${name}>`.length);
      end = closeEnd;
    }

    if (name === 'FAQ') {
      const formatted = formatFaq(open.selfClosing ? openTag : openTag + inner);
      if (formatted) out += `${formatted}\n`;
    } else if (name === 'Figure') {
      const caption = attrValue(openTag, 'caption') || attrValue(openTag, 'alt');
      if (caption) out += `${caption}\n`;
    } else if (DROP_WHOLE.has(name)) {
      // Key takeaways are already emitted from frontmatter. Drop the JSX.
    } else {
      const kept = replaceHtml(unwrapTemplateExpression(inner)).trim();
      if (kept) out += `${kept}\n`;
    }
    i = end;
  }
  return out;
}

export function stripMdxForLlms(source: string): string {
  let text = stripImportExports(source.replace(/\r\n/g, '\n'));
  text = replaceComponents(text);
  text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return text ? `${text}\n` : '';
}
