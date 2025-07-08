import type MarkdownIt from 'markdown-it';

const markerRE = /^\[\!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER|SUCCESS)\]/i;

const githubAlertsPlugin = (md: MarkdownIt, options?: any) => {
  const titleMark = {
    tip: "TIP",
    note: "NOTE",
    info: "INFO",
    important: "IMPORTANT",
    warning: "WARNING",
    caution: "CAUTION",
    danger: "DANGER",
    success: "SUCCESS"
  };

  const icons = {
    note: 'FilePen',
    tip: 'CircleHelp',
    info: 'Info',
    important: 'CircleAlert',
    warning: 'TriangleAlert',
    caution: 'Ban',
    danger: 'Siren',
    success: 'CircleCheck'
  };

  md.core.ruler.after("block", "github-alerts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "blockquote_open") {
        const startIndex = i;
        const open = tokens[startIndex];
        let endIndex = i + 1;

        while (endIndex < tokens.length && (tokens[endIndex].type !== "blockquote_close" || tokens[endIndex].level !== open.level)) {
          endIndex++;
        }

        if (endIndex === tokens.length) continue;

        const close = tokens[endIndex];
        const contentIdx = tokens.slice(startIndex, endIndex + 1).findIndex((token) => token.type === "inline");
        const firstContent = tokens[startIndex + contentIdx];
        if (!firstContent) continue;

        const match = firstContent.content.match(markerRE);
        if (!match) continue;

        const type = match[1].toLowerCase();
        const remainingContent = firstContent.content.slice(match[0].length);

        let finalTitle = titleMark[type];
        let bodyContent = '';
        if (!remainingContent.trim() || remainingContent.match(/^\s*\n/)) {
          // Pas de titre personnalisé, contenu direct ou vide
          bodyContent = remainingContent.trim();
        } else {
          // Titre personnalisé sur la même ligne
          const firstLineEnd = remainingContent.indexOf('\n');
          if (firstLineEnd !== -1) {
            finalTitle = remainingContent.slice(0, firstLineEnd).trim();
            bodyContent = remainingContent.slice(firstLineEnd).trim();
          } else {
            finalTitle = remainingContent.trim();
            bodyContent = '';
          }
        }

        // Si aucun contenu après le titre : supprimer le token
        if (!bodyContent) {
          tokens.splice(startIndex + contentIdx, 1); // Supprime le token inline vide
        } else {
          firstContent.content = bodyContent;
        }

        open.type = "github_alert_open";
        open.tag = "div";
        open.meta = {
          type,
          icon: icons[type],
          title: finalTitle
        };
        close.type = "github_alert_close";
        close.tag = "div";
      }
    }
  });

  md.renderer.rules.github_alert_open = function(tokens, idx) {
    const { title, type, icon } = tokens[idx].meta;
    return `<div class="${type} custom-block">
      <div class="custom-block-title">
        <${icon} class="alert-icon" />
        <span>${title}</span>
      </div>
      <div class="custom-block-body">\n`;
  };

  md.renderer.rules.github_alert_close = function() {
    return '</div></div>\n';
  };
};

export default githubAlertsPlugin;