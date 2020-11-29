module.exports = {
  tsconfig: 'tsconfig.lib.json',
  exclude: ['**/*(index|customTypings|.spec|.d).ts'],
  mode: 'modules',
  includeVersion: true,
  out: 'output/docs',
  theme: 'pages-plugin',
  pages: {
    replaceGlobalsPage: true,
    groups: [
      {
        title: 'Getting Started',
        pages: [
          {
            title: 'Quick Start',
            source: './documentation/getting-started/quick-start.md'
          }
        ]
      },
      {
        title: 'Examples',
        pages: [
          {
            title: 'Multi Format Reader',
            source: './documentation/examples/multi-format-reader.md'
          }
        ]
      }
    ]
  },
};
