import { defineConfig, type DefaultTheme } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import githubAlertsPlugin from './plugins/githubAlertsPlugin';
import lineNumberPlugin from './plugins/lineNumbers';
import detailsPlugin from './plugins/detailsPlugin';
import { themeImagesPlugin } from './plugins/theme-images'
import { fileURLToPath, URL } from 'node:url'

type NavItemWithBadge = DefaultTheme.NavItem & { badge?: string }
type SidebarItemWithBadge = DefaultTheme.SidebarItem & { badge?: string }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Exegol Docs",
  srcDir: 'src',
  description: "Official documentation for Exegol",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://docs.exegol.com',
  },
  head: [
    ['script',{ async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-7WC8L63R1S' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7WC8L63R1S');`
    ],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' }],
    ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/images/site.webmanifest' }],

  ],
  transformHead: ({ pageData }) => {
      const pageTitle = pageData.title ? `${pageData.title} | Exegol Documentation` : 'Exegol Documentation';
      const pageDescription = pageData.description || 'Official documentation for Exegol';
      return [
          ['title', {}, pageTitle],
          ['meta', { property: 'og:title', content: pageTitle }],
          ['meta', { property: 'og:description', content: pageDescription }],
          ['meta', { property: 'og:image', content: 'https://docs.exegol.com/images/Social_preview.png' }],
          ['meta', { name: 'twitter:title', content: pageTitle }],
          ['meta', { name: 'twitter:image', content: 'https://docs.exegol.com/images/Social_preview.png' }],
          ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
          ['meta', { name: 'twitter:description', content: pageDescription }]
      ];
  },
  themeConfig: {
    logo: {
      dark: '/images/Exegol_Symbol_DarkVersion.svg',
      light: '/images/Exegol_Symbol_LightVersion.svg'
    },
    search: {
      provider: 'local'
    },
    outline: "deep",
    docFooter: {
      prev: false,
      next: false
    },
    nav: nav(),
    sidebar: {
      '/contribute/': { base: '/contribute/', items: sidebarContribute() },
      '/legal/': { base: '/legal/', items: sidebarLegal() },
      '/': { base: '/', items: sidebarMain() }
    },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/cXThyp7D6P' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/exegol' },
      { icon: 'x', link: 'https://x.com/exegogol' },
      { icon: 'youtube', link: 'https://www.youtube.com/@exegogol' },
      { icon: 'github', link: 'https://github.com/ThePorgs/Exegol' },
    ]
  },

  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPMenuLink\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPMenuLink.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPBadge\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/Badge.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/CustomSidebar.vue', import.meta.url))
        }
      ]
    }
  },
  markdown: {
    config(md) {
        md.use(tabsMarkdownPlugin);
        md.use(githubAlertsPlugin);
        md.use(lineNumberPlugin);
        md.use(detailsPlugin);
        themeImagesPlugin()(md);
    }
  }
})

function nav(): NavItemWithBadge[] {
  return [
    {
      text: 'About Exegol',
      link: 'about',
    },
    {
      text: 'First install',
      link: 'first-install',
    },
    {
      text: 'FAQ',
      link: 'faq',
    },
    {
      text: 'Others',
      items: [
        {
          text: 'Landing',
          link: 'https://exegol.com/',
        },
        {
          text: 'Dashboard',
          link: 'https://dashboard.exegol.com/',
        },
        {
          text: 'Blog',
          link: '/blog/',
          activeMatch: '/blog/'
        },
        {
          text: 'Contribute',
          link: '/contribute/intro',
          activeMatch: '/contribute/intro'
        },
        {
          text: 'Legal',
          link: '/legal/summary',
          activeMatch: '/legal/summary'
        }
      ]
    },
    {
      text: 'Pricing',
      link: 'https://exegol.com/pricing',
    },
  ]
}

function sidebarContribute(): SidebarItemWithBadge[] {
  return [
    {
      text: "About contributions",
      link: "intro",
    },
    {
      text: "Components",
      items: [
        {
          text: "Images",
          link: "images"
        },
        {
          text: "Wrapper",
          link: "wrapper"
        },
        {
          text: "Resources",
          link: "resources"
        },
        {
          text: "Docs",
          link: "docs"
        } 
      ]
    },
    {
      text: "Miscellaneous",
      items: [
        {
          text: "Source install",
          link: "install",
        },
        {
          text: "Signing commits",
          link: "signing-commits"
        },
        {
          text: "Maintainers notes",
          link: "maintainers-notes"
        }
      ]
    }
  ]
}

function sidebarLegal(): SidebarItemWithBadge[] {
  return [
    {
      text: "Legal",
      items: [
        {
          text: "Summary",
          link: "summary"
        },
        {
          text: "Legal Notice",
          link: "legal-notice"
        },
        {
          text: "Terms of Service",
          link: "terms-of-service"
        },
        {
          text: "End User License Agreement",
          link: "eula"
        },
        {
          text: "Privacy Policy",
          link: "privacy-policy"
        },
        {
          text: "Cookie Policy",
          link: "cookie-policy"
        },
        {
          text: "Security Policy",
          link: "security-policy"
        },
        {
          text: "Exegol Software License",
          link: "software-license"
        },
        {
          text: "Open Source Components",
          link: "open-source-components"
        },

      ]
    }
  ]
}
function sidebarMain(): SidebarItemWithBadge[] {
  return [
    {
      text: "About Exegol",
      link: "about"
    },
    {
      text: "First install",
      link: "first-install",
    },
    {
      text: "Exegol images",
      collapsed: false,
      items: [
        {
          text: "Images",
          link: "images/types.md"
        },
        {
          text: "Tools list",
          link: "images/tools.md",
        },
        {
          text: "My resources",
          link: "images/my-resources.md"
        },
        {
          text: "Credentials",
          link: "images/credentials.md"
        },
        {
          text: "Services",
          link: "images/services.md"
        }
      ]
    },
    {
      text: "Exegol wrapper",
      collapsed: false,
      items: [
        {
          text: "Features",
          link: "wrapper/features.md"
        },
        {
          text: "Command-line actions",
          collapsed: true,
          items: [
            {
              text: "activate",
              link: "wrapper/cli/activate.md",
              badge: "pro"
            },
            {
              text: "build",
              link: "wrapper/cli/build.md",
              badge: "new"
            },
            {
              text: "exec",
              link: "wrapper/cli/exec.md"
            },
            {
              text: "info",
              link: "wrapper/cli/info.md"
            },
            {
              text: "install",
              link: "wrapper/cli/install.md"
            },
            {
              text: "remove",
              link: "wrapper/cli/remove.md"
            },
            {
              text: "restart",
              link: "wrapper/cli/restart.md"
            },
            {
              text: "start",
              link: "wrapper/cli/start.md"
            },
            {
              text: "stop",
              link: "wrapper/cli/stop.md"
            },
            {
              text: "uninstall",
              link: "wrapper/cli/uninstall.md"
            },
            {
              text: "update",
              link: "wrapper/cli/update.md"
            },
            {
              text: "version",
              link: "wrapper/cli/version.md"
            }
          ]
        },
        {
          text: "Advanced configuration",
          link: "wrapper/configuration.md"
        }
      ]
    },
    {
      text: "Exegol resources",
      collapsed: false,
      items: [
        {
          text: "Resources list",
          link: "resources/list.md"
        }
      ]
    },
    {
      text: "Dashboard",
      badge: "new",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "dashboard/overview.md"
        },
        {
          text: "Subscriptions",
          link: "dashboard/subscriptions.md"
        },
        {
          text: "Licenses",
          link: "dashboard/licenses.md"
        },
        {
          text: "Organizations",
          link: "dashboard/organizations.md",
          badge: "enterprise"
        },
        {
          text: "Learn",
          link: "dashboard/learn.md",
          badge: "new"
        },
        {
          text: "Referral",
          link: "dashboard/referral.md",
          badge: "pro"
        },
        {
          text: "Community",
          link: "dashboard/community.md",
        },
        {
          text: "Support",
          link: "dashboard/support.md"
        },
        {
          text: "Settings",
          link: "dashboard/settings.md"
        }
      ]
    },
    {
      text: "Frequently asked questions",
      link: "faq.md"
    },
    {
      text: "Troubleshooting",
      link: "troubleshooting.md"
    },
    {
      text: "Tips & tricks",
      link: "tips-and-tricks.md"
    }
  ]
}
