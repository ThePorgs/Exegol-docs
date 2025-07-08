// https://vitepress.dev/guide/custom-theme
import { h, onMounted, nextTick, watch } from 'vue'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import { useMediaQuery } from '@vueuse/core'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import mediumZoom from 'medium-zoom'
import Asciinema from './components/Asciinema.vue'
import CSVTable from './components/CSVMarkdown.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import CustomSidebarItem from './components/CustomSidebarItem.vue'
import BlogList from './components/BlogList.vue'

import {
  CircleHelp,
  CircleAlert,
  CircleCheck,
  FileText,
  GitPullRequest,
  LayoutDashboard,
  TriangleAlert,
  FilePen,
  Ban,
  Info,
  Siren,
  Store,
  Newspaper,
  Scale,
} from 'lucide-vue-next'

import 'lucide-static/font/lucide.css'
import './custom.css'

const isMobileorTablet = useMediaQuery('(max-width: 1279px)')

// Mapping des icônes pour la navbar
const navIcons = {
  Contribute: GitPullRequest,
  Legal: Scale,
  Dashboard: LayoutDashboard,
  Landing: Store,
  Blog: Newspaper
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp({ app, router, siteData }) {
    app.component('VPSidebarItem', CustomSidebarItem)
    app.component('BlogList', BlogList)
    enhanceAppWithTabs(app)
    

    // Fournir le mapping d'icônes à l'application
    app.provide('nav-icon-map', navIcons)


    app.component('Asciinema', Asciinema)
    app.component('markdownTable', CSVTable)
    app.component('YouTubeVideo', YouTubeVideo)


    // Lucide icons for pages
    app.component('Newspaper', Newspaper) // Blog page
    app.component('Scale', Scale) // Legal page
    app.component('GitPullRequest', GitPullRequest) // Contribute page
    app.component('LayoutDashboard', LayoutDashboard) // Dashboard link
    app.component('Store', Store) // Landing page link
    
    // Lucide icons for callout / alerts
    app.component('CircleHelp', CircleHelp) // TIP Callout
    app.component('CircleAlert', CircleAlert) // IMPORTANT Callout
    app.component('CircleCheck', CircleCheck) // SUCCESS Callout
    app.component('TriangleAlert', TriangleAlert) // WARNING BLOCK
    app.component('FilePen', FilePen) // NOTE BLOCK
    app.component('Ban', Ban) // CAUTION BLOCK
    app.component('Info', Info) // INFO BLOCK
    app.component('Siren', Siren) // DANGER BLOCK

  },
  
  setup() {
    const route = useRoute()

    const initZoom = () => {
      const margin = isMobileorTablet.value ? 0 : 150
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
} satisfies Theme
