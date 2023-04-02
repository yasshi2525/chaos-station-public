import { ResourceManager } from '../../src/behaviors/resource_manager'
import { DemoManager } from '../../src/behaviors/demo_manager'

describe('demo_manager', () => {
  let resourceManager: ResourceManager

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
  })

  it.each([false, true])('run', async (grid) => {
    const inst = new DemoManager({
      scene,
      resourceManager,
      grid
    })
    expect(() => inst.start()).not.toThrow()
    await context.advance(5000)
  })
})
