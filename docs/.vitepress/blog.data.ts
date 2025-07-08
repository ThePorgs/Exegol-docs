export const blogPosts = Object.entries(
    import.meta.glob('../../../src/blog/*.md', { eager: true })
  ).map(([path, mod]: any) => {
    const url = path.replace('../', '/').replace('.md', '')
    return {
      ...mod,
      url,
      title: mod.frontmatter?.title,
      date: mod.frontmatter?.date,
      description: mod.frontmatter?.description,
    }
  })
  