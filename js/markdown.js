/* ==========================================================================
   markdown.js — a small renderer for the design notes
   Handles: headings, paragraphs, lists, tables, fenced code, blockquotes,
   rules, and inline bold / italic / code / links.
   ========================================================================== */

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return '\u0000' + (codes.length - 1) + '\u0001';
  });

  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0001/g, (_, n) => '<code>' + codes[Number(n)] + '</code>');
  return s;
}

const isBlockStart = (l) =>
  /^```/.test(l) ||
  /^#{1,6}\s/.test(l) ||
  /^\s*([-*+]|\d+\.)\s+/.test(l) ||
  /^\s*>\s?/.test(l) ||
  /^\s*\|/.test(l) ||
  /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l);

function tableCells(row) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function renderTable(rows) {
  const isSep = (r) => {
    const cs = tableCells(r);
    return cs.length > 0 && cs.every((c) => /^:?-{2,}:?$/.test(c));
  };

  const head = tableCells(rows[0]);
  let rest = rows.slice(1);
  if (rest.length && isSep(rest[0])) rest = rest.slice(1);

  let html = '<table><thead><tr>' +
    head.map((c) => `<th scope="col">${inline(c)}</th>`).join('') +
    '</tr></thead><tbody>';

  for (const r of rest) {
    const cs = tableCells(r);
    html += '<tr>' + head.map((_, i) => (i === 0
      ? `<th scope="row">${inline(cs[i] || '')}</th>`
      : `<td>${inline(cs[i] || '')}</td>`)).join('') + '</tr>';
  }
  return html + '</tbody></table>';
}

export function renderMarkdown(src) {
  const lines = escapeHtml(src).split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* fenced code */
    if (/^\s*```/.test(line)) {
      i++;
      const buf = [];
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code>${buf.join('\n')}</code></pre>`);
      continue;
    }

    /* rule */
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    /* heading */
    const hm = line.match(/^(#{1,6})\s+(.*)$/);
    if (hm) {
      const n = hm[1].length;
      out.push(`<h${n}>${inline(hm[2].trim())}</h${n}>`);
      i++;
      continue;
    }

    /* blockquote */
    if (/^\s*>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    /* table */
    if (/^\s*\|/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      out.push(renderTable(buf));
      continue;
    }

    /* list */
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, ''));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`);
      continue;
    }

    /* blank */
    if (!line.trim()) {
      i++;
      continue;
    }

    /* paragraph */
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      buf.push(lines[i].trim());
      i++;
    }
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
    else i++;
  }

  return out.join('\n');
}
