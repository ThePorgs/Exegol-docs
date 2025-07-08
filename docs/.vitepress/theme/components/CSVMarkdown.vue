<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Papa from 'papaparse'
import { Download } from 'lucide-vue-next'

const props = defineProps({
  file: String
})

const tableData = ref<string[][]>([])
const toolLinks = ref<Map<number, string>>(new Map())

const isDownloadLink = (text: string) =>
  (text.includes('[download]') || text.includes(':download:'))

const isValidUrl = (text: string) => {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

const processTableData = (data: string[][]) => {
  if (data.length === 0) return data

  const linkColIndex = data[0].findIndex(header => header.toLowerCase() === 'link')
  if (linkColIndex === -1) return data

  // Store links for tools and resources
  data.slice(1).forEach((row, rowIndex) => {
    if (isValidUrl(row[linkColIndex])) {
      toolLinks.value.set(rowIndex, row[linkColIndex])
    }
  })

  // Remove the link column
  return data.map(row => row.filter((_, colIndex) => colIndex !== linkColIndex))
}

const extractDownloadLink = (text: string) => {
  let match = text.match(/\[download\]\(([^)]+)\)/)
  if (match) {
    return { href: match[1].replace(/^<|>$/g, '') }
  }
  
  match = text.match(/:download:`[^`]+\s+([^`]+)`/)
  if (match) {
    return { href: match[1].replace(/^<|>$/g, '') }
  }
  
  return null
}

const handleDownload = async (event: MouseEvent, href: string | undefined) => {
  event.preventDefault()
  if (!href) return
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
  } catch (error) {
    console.error('Download failed:', error)
  }
}

onMounted(async () => {
  if (!props.file) {
    console.error('No file specified')
    return
  }
  try {
    const response = await fetch(props.file)
    const text = await response.text()
    const parsed = Papa.parse<string[]>(text.trim(), {
      skipEmptyLines: true
    })
    tableData.value = processTableData(parsed.data)
  } catch (error) {
    console.error('Error loading CSV file:', error)
  }
})
</script>

<template>
  <table class="auto-generated-table" v-if="tableData.length">
    <thead>
      <tr>
        <th v-for="(header, index) in tableData[0]" :key="'head-' + index">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in tableData.slice(1)" :key="rowIndex">
        <td
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="{ 'centered-button': isDownloadLink(cell) }"
        >
          <template v-if="isDownloadLink(cell)">
            <button 
              class="download-button"
              @click="(e) => handleDownload(e, extractDownloadLink(cell)?.href)"
            >
              <Download class="download-icon" />
            </button>
          </template>
          <template v-else-if="cellIndex === 0 && (tableData[0][0].toLowerCase() === 'tool' || tableData[0][0].toLowerCase() === 'resource') && toolLinks.get(rowIndex)">
            <a :href="toolLinks.get(rowIndex)" target="_blank" rel="noopener noreferrer">{{ cell }}</a>
          </template>
          <template v-else>
            {{ cell }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>


