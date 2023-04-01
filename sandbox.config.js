module.exports = {
  showMenu: true,
  displayOptions: {
    fitsToScreen: true,
    backgroundColor: 'black',
    showsGrid: false,
    showsProfiler: false,
    showsDesignGuideline: false
  },
  autoSendEventName: 'gameEvents',
  events: {
    gameEvents: [
      [
        32,
        0,
        'dummy',
        {
          type: 'start',
          parameters: {
            mode: 'ranking',
            totalTimeLimit: 40,
            randomSeed: new Date().getTime(),
            debug: false
          }
        }
      ]
    ]
  }
}
