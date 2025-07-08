import type MarkdownIt from 'markdown-it';
import { ChevronRight } from 'lucide-vue-next';

const detailsMarkerRE = /^::: details\s+(.+)$/;

const detailsPlugin = (md: MarkdownIt) => {
  md.block.ruler.before('fence', 'details', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(start, max);

    const match = line.match(detailsMarkerRE);
    if (!match) return false;

    if (silent) return true;

    const title = match[1].trim();
    const token = state.push('details_open', 'details', 1);
    token.markup = ':::';
    token.block = true;
    token.info = title;

    state.line = startLine + 1;
    return true;
  });

  md.block.ruler.after('details', 'details_close', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(start, max);

    if (line.trim() !== ':::') return false;

    if (silent) return true;

    const token = state.push('details_close', 'details', -1);
    token.markup = ':::';
    token.block = true;

    state.line = startLine + 1;
    return true;
  });

  md.renderer.rules.details_open = (tokens, idx) => {
    const title = tokens[idx].info;
    return `<details class="custom-block details">
      <summary class="custom-block-title">
        <div class="custom-block-icon">
          <ChevronRight class="alert-icon" />
        </div>
        <span>${title}</span>
      </summary>
      <div class="custom-block-content-wrapper">
        <div class="custom-block-content">\n`;
  };

  md.renderer.rules.details_close = () => {
    return '</div></div></details>\n';
  };
};

export default detailsPlugin; 