<script setup lang="ts">
// Chargement des fichiers markdown du blog
const postModules = import.meta.glob('/blog/*.md', { eager: true })

const formatDate = (date: string) => {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

const posts = Object.entries(postModules)
  .map(([path, mod]: any) => {
    const frontmatter = mod.frontmatter
      ?? mod.__pageData?.frontmatter
      ?? mod.metadata
      ?? {}

    const url = path.replace(/\/index\.md$/, '/').replace(/\.md$/, '')

    return {
      url,
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.description,
      author: frontmatter.author ?? 'Exegol Team',
      tags: frontmatter.tags ?? [],
    }
  })
  .filter(post => post.title && post.date)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
</script>

<template>
  <div class="blog-list">
    <a v-for="post in posts" :key="post.url" :href="post.url" class="blog-card">
      <small class="blog-meta">
        Created {{ formatDate(post.date) }} - {{ post.author }}
      </small>
      <h2 class="blog-title">{{ post.title }}</h2>
      <p class="blog-description">{{ post.description }}</p>
      <div v-if="post.tags.length" class="blog-tags">
        <span v-for="tag in post.tags" :key="tag" class="blog-tag">#{{ tag }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.blog-card {
  position: relative;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  display: block;
  transition: all 0.25s ease;
}

.blog-card:hover {
  border-color: var(--accent-primary);
  background-color: var(--accent-overlay);
  box-shadow: 0px 0px 5px var(--accent-primary);
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-subtle);
}

.blog-title {
  margin: 0;
  padding: 0;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 350;
  line-height: 1.4;
  color: var(--vp-c-text-primary);
}

.blog-description {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 300;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.blog-tag {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .blog-card {
    padding: 1rem 1.25rem;
  }

  .blog-title {
    font-size: 1.1rem;
  }

  .blog-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .blog-tag {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
  }
}
</style>
