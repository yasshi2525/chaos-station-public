import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { StairView } from '../../src/views/stair_view'

describe('stair_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getPlatformResources()
  })
  it('onRotated', () => {
    const inst = new StairView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    let cnt = 0
    inst.onRotated.add(() => {
      cnt++
    })
    resourceManager.addResourceOnPlatform(inst)
    resourceManager.angle = Math.PI / 4
    expect(cnt).toBe(1)
  })
})
