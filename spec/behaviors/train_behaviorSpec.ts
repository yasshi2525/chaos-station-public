import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PlatformView } from '../../src/views/platform_view'
import { TrainBehavior } from '../../src/behaviors/train_behavior'

describe('train_behavior', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let platform: PlatformView
  let inst: TrainBehavior

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getGroundResources()
    inst = resourceManager.getTrainBehavior()
    platform = new PlatformView({
      scene,
      projectionManager,
      baseWidth: 100,
      baseHeight: 100,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
  })

  it('addPlatform', () => {
    expect(() => inst.addPlatform(platform)).not.toThrow()
  })

  it('start', async () => {
    expect(() => inst.start()).not.toThrow()
    await context.advance(10000)
  })
})
