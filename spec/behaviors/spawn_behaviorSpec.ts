import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { SpawnBehavior } from '../../src/behaviors/spawn_behavior'
import { StairView } from '../../src/views/stair_view'
import { PlatformView } from '../../src/views/platform_view'

describe('spawn_behavior', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let inst: SpawnBehavior
  let platform: PlatformView
  let stair: StairView

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    inst = resourceManager.getSpawnBehavior()
    projectionManager = resourceManager.getPlatformResources()
    platform = new PlatformView({
      scene,
      baseWidth: 100,
      baseHeight: 100,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    stair = new StairView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    resourceManager.addPlatform(platform)
    resourceManager.addStair(stair, platform)
  })

  it('add', () => {
    expect(() => inst.add(stair)).not.toThrow()
  })

  it('start', async () => {
    expect(() => inst.start()).not.toThrow()
    await context.advance(2000)
  })
})
