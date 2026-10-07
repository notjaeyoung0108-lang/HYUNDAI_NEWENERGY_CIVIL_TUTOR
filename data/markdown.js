window.renderMarkdown = (() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const inline = value => esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
  // A deliberately small, escaped Markdown dialect matching docs/. Raw HTML is never executed.
  function markdown(source) {
    const lines = String(source || '').split('\n');
    const out = []; let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {
        const code = []; i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
        if (i < lines.length) i++;
        out.push(`<pre tabindex="0" aria-label="현장 도식, 가로로 스크롤"><code>${esc(code.join('\n'))}</code></pre>`); continue;
      }
      const disclosure = /^<details><summary>(.*?)<\/summary>\s*$/.exec(line.trim());
      if (disclosure) {
        const body = []; i++;
        while (i < lines.length && lines[i].trim() !== '</details>') body.push(lines[i++]);
        if (i < lines.length) i++;
        out.push(`<details><summary>${inline(disclosure[1])}</summary><div class="details-body">${markdown(body.join('\n'))}</div></details>`); continue;
      }
      if (/^---+$/.test(line.trim())) { out.push('<hr>'); i++; continue; }
      const heading = /^(#{1,4})\s+(.+)/.exec(line);
      if (heading) { const n = heading[1].length; out.push(`<h${n}>${inline(heading[2])}</h${n}>`); i++; continue; }
      if (/^>/.test(line)) { out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); i++; continue; }
      if (/^[-*] /.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*] /.test(lines[i])) items.push(`<li>${inline(lines[i++].slice(2))}</li>`);
        out.push(`<ul>${items.join('')}</ul>`); continue;
      }
      if (/^\d+\. /.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(/^\d+\. /, ''))}</li>`);
        out.push(`<ol>${items.join('')}</ol>`); continue;
      }
      if (line.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1] || '')) {
        const cells = l => l.replace(/^\||\|$/g, '').split('|').map(x => inline(x.trim()));
        const head = cells(line); const rows = []; i += 2;
        while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
        out.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="교재 표, 가로로 스크롤"><table><thead><tr>${head.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
      }
      const p = [line]; i++;
      while (i < lines.length && lines[i].trim() && !/^(#|>|[-*] |\d+\. |\||```)/.test(lines[i])) p.push(lines[i++]);
      out.push(`<p>${inline(p.join(' '))}</p>`);
    }
    return out.join('');
  }
return markdown;
})();
