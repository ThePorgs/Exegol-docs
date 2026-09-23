import type MarkdownIt from 'markdown-it'

type MdToken = {
  type: string
  content: string
  attrGet: (name: string) => string | null
  children?: MdToken[] | null
  map?: [number, number] | null
}

function isThemedImage(token: MdToken): boolean {
  if (token.type !== 'image') return false
  const theme = token.attrGet('data-theme')
  return theme === 'light' || theme === 'dark'
}

function isIgnorable(token: MdToken): boolean {
  if (token.type === 'softbreak' || token.type === 'hardbreak') return true
  return token.type === 'text' && token.content.trim() === ''
}

function captionFromMarker(token: MdToken): string | null {
  if (token.type !== 'text' || typeof token.content !== 'string') return null
  const match = token.content.match(/^(.*)\s*\{\.caption\}$/)
  return match ? match[1].trim() : null
}

function hasCaptionClass(token: MdToken): boolean {
  return (token.attrGet('class') || '').split(/\s+/).includes('caption')
}

function renderThemedImage(md: MarkdownIt, token: MdToken, tag: 'div' | 'span'): string {
  const src = md.utils.escapeHtml(token.attrGet('src') || '')
  const theme = token.attrGet('data-theme')
  const alt = md.utils.escapeHtml(token.content)
  return `<${tag} class="theme-image"><img src="${src}" class="${theme}-theme-image" alt="${alt}" /></${tag}>`
}

function renderPlainImage(md: MarkdownIt, token: MdToken): string {
  const src = md.utils.escapeHtml(token.attrGet('src') || '')
  const alt = md.utils.escapeHtml(token.content)
  const title = token.attrGet('title')
  const titleAttr = title ? ` title="${md.utils.escapeHtml(title)}"` : ''
  return `<img src="${src}" alt="${alt}"${titleAttr}>`
}

export function themeImagesPlugin() {
  return function (md: MarkdownIt) {
    const defaultImageRule = md.renderer.rules.image!

    // Must run after markdown-it-attrs (`curly_attributes`): that plugin attaches
    // {data-theme} to images and {.caption} to the wrapping paragraph. Images are
    // inline, so markdown-it still wraps them in <p>. Themed images render as
    // <div>, and captions as <p class="caption">. Both are invalid inside <p>.
    const transform = (state: { tokens: MdToken[]; Token: new (type: string, tag: string, nesting: number) => any }) => {
      const tokens = state.tokens

      for (let i = 0; i < tokens.length - 2; i++) {
        if (tokens[i].type !== 'paragraph_open') continue
        const inline = tokens[i + 1]
        const close = tokens[i + 2]
        if (inline?.type !== 'inline' || !inline.children || close?.type !== 'paragraph_close') {
          continue
        }

        const images: MdToken[] = []
        const textTokens: MdToken[] = []
        let mixed = false

        for (const child of inline.children) {
          if (isIgnorable(child)) continue
          if (child.type === 'image') {
            images.push(child)
            continue
          }
          if (child.type === 'text') {
            textTokens.push(child)
            continue
          }
          mixed = true
          break
        }
        if (mixed || images.length === 0) continue

        let caption: string | null = null
        const leftover: string[] = []
        for (const textToken of textTokens) {
          const marked = captionFromMarker(textToken)
          if (marked !== null) {
            caption = marked
          } else if (textToken.content.trim()) {
            leftover.push(textToken.content.trim())
          }
        }
        if (caption === null && hasCaptionClass(tokens[i]) && leftover.length > 0) {
          caption = leftover.join(' ')
          leftover.length = 0
        }

        const onlyImages = leftover.length === 0
        if (!onlyImages) continue
        if (caption === null && !images.some(isThemedImage)) continue

        const parts: string[] = []
        for (const image of images) {
          parts.push(
            isThemedImage(image) ? renderThemedImage(md, image, 'div') : renderPlainImage(md, image)
          )
        }
        if (caption !== null) {
          parts.push(`<p class="caption">${md.utils.escapeHtml(caption)}</p>`)
        }

        const htmlToken = new state.Token('html_block', '', 0)
        htmlToken.content = parts.join('\n') + '\n'
        htmlToken.map = tokens[i].map
        tokens.splice(i, 3, htmlToken)
      }
    }

    try {
      md.core.ruler.after('curly_attributes', 'theme-images-and-captions', transform)
    } catch {
      md.core.ruler.push('theme-images-and-captions', transform)
    }

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      if (!token.attrGet('src') || !isThemedImage(token)) {
        return defaultImageRule(tokens, idx, options, env, self)
      }
      // Mixed-content fallback: span is valid inside <p>, div is not.
      return renderThemedImage(md, token, 'span')
    }
  }
}
