import type MarkdownIt from 'markdown-it'

const scrollRE = /(?:^|\s):scroll(?=$|\s)/

const codeScrollPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const originalInfo = token.info
    const scroll = scrollRE.test(originalInfo)

    if (scroll) {
      token.info = originalInfo.replace(scrollRE, ' ').replace(/\s+/g, ' ').trim()
    }

    const rawCode = fence(...args)
    token.info = originalInfo
    if (!scroll) return rawCode

    return rawCode.replace(/"(language-[^"]*?)"/, '"$1 code-scroll"')
  }
}

export default codeScrollPlugin
