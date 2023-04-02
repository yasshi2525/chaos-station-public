import { ResourceManager } from '../../src/behaviors/resource_manager'
import { TrainView } from '../../src/views/train_view'
import { ProjectionManager } from '../../src/behaviors/projection_manager'

describe('train_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getGroundResources()
  })

  it('近くに生成せず、離す', () => {
    const inst = new TrainView({
      scene,
      doors: 2,
      projectionManager,
      baseWidth: 200,
      baseHeight: 200,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0,
      destination: {
        logicalX: 0,
        logicalY: 0,
        logicalZ: 0
      }
    })
    expect(inst.logicalOffset.logicalX).toBeGreaterThan(0)
  })
})
