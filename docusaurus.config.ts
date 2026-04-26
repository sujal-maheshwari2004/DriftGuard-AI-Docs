import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'DriftGuard',
  tagline: 'Semantic mistake memory and guardrail layer for autonomous agents.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://driftguard.example.com',
  baseUrl: '/',

  organizationName: 'sujal-maheshwari2004',
  projectName: 'driftguard-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'DriftGuard',
      logo: {
        alt: 'DriftGuard logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/mcp-server',
          label: 'MCP',
          position: 'left',
        },
        {
          to: '/docs/guard-policies',
          label: 'Policies',
          position: 'left',
        },
        {
          to: '/docs/cli-reference',
          label: 'CLI',
          position: 'left',
        },
        {
          href: 'https://github.com/sujal-maheshwari2004/DriftGuard',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Quickstart', to: '/docs/quickstart' },
            { label: 'Installation', to: '/docs/installation' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Guard Policies', to: '/docs/guard-policies' },
            { label: 'MCP Server', to: '/docs/mcp-server' },
            { label: 'CLI Reference', to: '/docs/cli-reference' },
          ],
        },
        {
          title: 'Integrations',
          items: [
            { label: 'LangGraph', to: '/docs/langgraph-adapter' },
            { label: 'Generic Adapter', to: '/docs/generic-adapter' },
            { label: 'Storage Backends', to: '/docs/storage' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/sujal-maheshwari2004/DriftGuard' },
            { label: 'PyPI', href: 'https://pypi.org/project/driftguard-ai' },
            { label: 'Contributing', to: '/docs/contributing' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} DriftGuard — MIT License`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['python', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;