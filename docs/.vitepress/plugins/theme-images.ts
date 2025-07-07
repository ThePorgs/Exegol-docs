import type MarkdownIt from 'markdown-it'

export function themeImagesPlugin() {
  return function (md: MarkdownIt) {
    const defaultImageRule = md.renderer.rules.image!

    md.core.ruler.after('inline', 'caption-only', state => {
      const tokens = state.tokens
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token.type === 'inline' && Array.isArray(token.children)) {
          for (let j = 0; j < token.children.length; j++) {
            const child = token.children[j]
            if (
              child.type === 'text' &&
              typeof child.content === 'string'
            ) {
              // Expression régulière : capture tout texte suivi de "{.caption}" optionnellement précédé d'un espace
              const match = child.content.match(/^(.*)\s*\{\.caption\}$/)
              if (match) {
                const caption = match[1].trim()
                const htmlToken = new state.Token('html_block', '', 0)
                htmlToken.content = `<p class="caption">${caption}</p>`
                // Insère le token html juste après
                tokens.splice(i + 1, 0, htmlToken)
                // Supprime le token enfant
                token.children.splice(j, 1)
                j--
              }
            }
          }
        }
      }
    })

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const src = token.attrGet('src')
      if (!src) return defaultImageRule(tokens, idx, options, env, self)

      // Parse les attributs Markdown
      const attrs = token.attrs || []
      const themeAttr = attrs.find(([key]) => key === 'data-theme')
      const theme = themeAttr ? themeAttr[1] : null

      if (!theme || (theme !== 'light' && theme !== 'dark')) {
        // Si pas de thème spécifié, utiliser l'image pour les deux thèmes
        return defaultImageRule(tokens, idx, options, env, self)
      }

      // Si un thème est spécifié, n'inclure que l'image appropriée
      return `
        <div class="theme-image">
          <img src="${src}" class="${theme}-theme-image" alt="${token.content}" />
        </div>
      `
    }
  }
}
