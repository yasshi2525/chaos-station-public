import './mock'

beforeEach(async () => {
  global.scene = await load()
})

afterEach(() => {
  unload()
})
