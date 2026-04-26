import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: '▸ Getting Started',
      collapsed: false,
      items: ['intro', 'installation', 'quickstart'],
    },
    {
      type: 'category',
      label: '▸ Core Concepts',
      collapsed: false,
      items: [
        'how-it-works',
        'guard-policies',
        'memory-graph',
        'storage',
      ],
    },
    {
      type: 'category',
      label: '▸ Integrations',
      collapsed: false,
      items: [
        'mcp-server',
        'langgraph-adapter',
        'generic-adapter',
      ],
    },
    {
      type: 'category',
      label: '▸ Reference',
      collapsed: false,
      items: [
        'cli-reference',
        'configuration',
        'metrics',
        'benchmark',
      ],
    },
    {
      type: 'category',
      label: '▸ Project',
      collapsed: true,
      items: ['contributing', 'changelog'],
    },
  ],
};

export default sidebars;