<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Papa from 'papaparse'
import { Download } from 'lucide-vue-next'
import { formatBuildDate } from '../formatBuildDate'

type Arch = 'amd64' | 'arm64'

interface Release {
  tag: string
  version: string
  arch: Arch
  date: string
  href: string
}

const TAG_ORDER = ['nightly', 'full', 'ad', 'osint', 'web', 'light']
const ARCH_ORDER: Arch[] = ['amd64', 'arm64']
const ARCH_LABELS: Record<Arch, string> = {
  amd64: 'AMD64',
  arm64: 'ARM64'
}
const SOURCES: { file: string; arch?: Arch }[] = [
  { file: '/installed_tools/nightly.csv' },
  { file: '/installed_tools/releases_amd64.csv', arch: 'amd64' },
  { file: '/installed_tools/releases_arm64.csv', arch: 'arm64' }
]

const releases = ref<Release[]>([])
const loaded = ref(false)
const error = ref('')
const selectedTag = ref('')
const selectedVersion = ref('')

const extractDownloadLink = (text: string) => {
  const markdown = text.match(/\[download\]\(([^)]+)\)/)
  if (markdown) return markdown[1].replace(/^<|>$/g, '')

  const sphinx = text.match(/:download:`[^`]+\s+([^`]+)`/)
  if (sphinx) return sphinx[1].replace(/^<|>$/g, '')

  return ''
}

const compareVersionsDesc = (a: string, b: string) => {
  const pa = a.split('.').map(part => Number.parseInt(part, 10))
  const pb = b.split('.').map(part => Number.parseInt(part, 10))
  const length = Math.max(pa.length, pb.length)
  for (let i = 0; i < length; i++) {
    const av = Number.isFinite(pa[i]) ? pa[i] : -1
    const bv = Number.isFinite(pb[i]) ? pb[i] : -1
    if (av !== bv) return bv - av
  }
  return b.localeCompare(a)
}

const tags = computed(() => {
  const present = new Set(releases.value.map(release => release.tag))
  const ordered = TAG_ORDER.filter(tag => present.has(tag))
  const extra = [...present].filter(tag => !TAG_ORDER.includes(tag)).sort()
  return [...ordered, ...extra]
})

const needsVersion = computed(() => selectedTag.value !== '' && selectedTag.value !== 'nightly')

const versions = computed(() => {
  if (!needsVersion.value) return []
  const present = new Set(
    releases.value
      .filter(release => release.tag === selectedTag.value)
      .map(release => release.version)
  )
  return [...present].sort(compareVersionsDesc)
})

const matches = computed(() => {
  if (!selectedTag.value) return []
  return releases.value
    .filter(release => {
      if (release.tag !== selectedTag.value) return false
      if (!needsVersion.value) return true
      return release.version === selectedVersion.value
    })
    .sort((a, b) => ARCH_ORDER.indexOf(a.arch) - ARCH_ORDER.indexOf(b.arch))
})

const hint = computed(() => {
  if (!loaded.value || error.value || matches.value.length) return ''
  if (!selectedTag.value) return 'Select an image tag.'
  if (needsVersion.value) return 'Select a version.'
  return ''
})

watch(selectedTag, () => {
  selectedVersion.value = ''
})

const loadReleases = async (file: string, archFromFile?: Arch): Promise<Release[]> => {
  const response = await fetch(file)
  if (!response.ok) throw new Error(`Could not load ${file}`)
  const text = await response.text()
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim()
  })

  return parsed.data.flatMap(row => {
    const tag = (row['Image tag'] || '').trim()
    const version = (row.Version || '').trim()
    const arch = (archFromFile || row.Arch || '').trim()
    const date = (row['Build date'] || '').trim()
    const href = extractDownloadLink(row['Tools list'] || '')
    if (!tag || !version || !href) return []
    if (arch !== 'amd64' && arch !== 'arm64') return []
    return [{ tag, version, arch, date, href }]
  })
}

const handleDownload = async (event: MouseEvent, href: string) => {
  event.preventDefault()
  try {
    const response = await fetch(href)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = href.split('/').pop() || 'download.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (downloadError) {
    console.error('Download failed:', downloadError)
  }
}

onMounted(async () => {
  try {
    const lists = await Promise.all(SOURCES.map(source => loadReleases(source.file, source.arch)))
    releases.value = lists.flat()
  } catch (loadError) {
    console.error('Error loading release lists:', loadError)
    error.value = 'The release list could not be loaded.'
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <div class="release-search">
    <p v-if="error" class="release-search-hint">{{ error }}</p>
    <template v-else>
      <div class="release-search-fields">
        <label>
          <span>Image tag</span>
          <span class="release-search-control">
            <select v-model="selectedTag" :disabled="!loaded">
              <option value="" disabled>Select an image tag</option>
              <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </span>
        </label>
        <label v-if="needsVersion">
          <span>Version</span>
          <span class="release-search-control">
            <select v-model="selectedVersion">
              <option value="" disabled>Select a version</option>
              <option v-for="version in versions" :key="version" :value="version">{{ version }}</option>
            </select>
          </span>
        </label>
      </div>

      <p v-if="hint">{{ hint }}</p>

      <table v-if="matches.length" class="auto-generated-table">
        <thead>
          <tr>
            <th>Architecture</th>
            <th>Build date</th>
            <th>Tools list</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="release in matches" :key="release.arch">
            <td>{{ ARCH_LABELS[release.arch] }}</td>
            <td :title="release.date">{{ formatBuildDate(release.date) }}</td>
            <td>
              <button
                type="button"
                class="download-button"
                @click="(event) => handleDownload(event, release.href)"
              >
                <Download class="download-icon" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.release-search-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: end;
  margin: 8px 0 16px;
}

.release-search label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  color: var(--vp-c-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.release-search-control {
  position: relative;
  display: block;
}

.release-search-control::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 16px;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid var(--vp-c-text-subtle);
  border-bottom: 1.5px solid var(--vp-c-text-subtle);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.release-search select {
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 0 40px 0 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--radius);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-secondary);
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  cursor: pointer;
  appearance: none;
}

.release-search select:focus {
  outline: none;
  border-color: var(--vp-c-text-secondary);
}

.release-search-control:has(select:disabled) {
  opacity: 0.55;
}

.release-search select:disabled {
  cursor: not-allowed;
}

.release-search :deep(th),
.release-search :deep(td) {
  vertical-align: middle;
  white-space: nowrap;
}

.release-search :deep(th:last-child),
.release-search :deep(td:last-child) {
  width: 1%;
  text-align: left;
}

.release-search :deep(.download-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: -12px;
  vertical-align: middle;
}

@media (max-width: 640px) {
  .release-search-fields {
    grid-template-columns: 1fr;
  }
}
</style>
