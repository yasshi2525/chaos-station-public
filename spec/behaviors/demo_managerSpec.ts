import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { DemoManager } from '../../src/behaviors/demo_manager'

describe('demo_manager', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getPlatformResources()
  })

  it.each([false, true])('run', async (grid) => {
    const inst = new DemoManager({
      scene,
      resourceManager,
      projectionManager,
      grid
    })
    expect(() => inst.start()).not.toThrow()
    await context.advance(5000)
  })
})
