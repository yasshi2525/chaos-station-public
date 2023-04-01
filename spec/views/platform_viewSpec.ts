import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'

describe('platform_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getGroundResources()
  })
  it('onRotated', () => {
    expect(projectionManager.getSubjects()).toHaveLength(1)
    const inst = projectionManager.getSubjects()[0]
    let cnt = 0
    inst.onRotated.add(() => {
      cnt++
    })
    resourceManager.angle = Math.PI / 4
    expect(cnt).toBe(1)
  })
})
