import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { DemoManager } from '../../src/behaviors/demo_manager'

describe('demo_manager', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager

  beforeEach(() => {
    resourceManager = new ResourceManager({ scene })
    projectionManager = resourceManager.getPlatformResources()
  })

  it('start', () => {
    const inst = new DemoManager({
      scene,
      resourceManager,
      projectionManager
    })
    expect(() => inst.start()).not.toThrow()
  })
})
