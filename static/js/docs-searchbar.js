document.addEventListener('DOMContentLoaded', () => {
  const meiliSettings = CONFIG.meili
  const { indexUid, hostUrl, apiKey } = meiliSettings
  docsSearchBar({
    hostUrl: hostUrl,
    apiKey: apiKey,
    indexUid: indexUid,
    inputSelector: '#search',
    debug: true, // Set debug to true if you want to inspect the dropdown
    meilisearchOptions: {
      limit: 15
    },
    enableDarkMode: 'auto'
  })
})
