import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PlatformView } from '../../src/views/platform_view'

describe('platform_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let inst: PlatformView
  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getGroundResources()
    inst = new PlatformView({
      scene,
      projectionManager,
      baseWidth: 100,
      baseHeight: 100,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    resourceManager.addPlatform(inst)
  })
  it('onRotated', () => {
    expect(projectionManager.getSubjects()).toHaveLength(2)
    const inst = projectionManager.getSubjects()[0]
    let cnt = 0
    inst.onRotated.add(() => {
      cnt++
    })
    resourceManager.angle = Math.PI / 4
    expect(cnt).toBe(1)
  })
})
