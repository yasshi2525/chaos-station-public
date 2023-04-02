import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PassengerView } from '../../src/views/passenger_view'

describe('passenger_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let inst: PassengerView
  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getPlatformResources()
    inst = new PassengerView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    resourceManager.addPassenger(inst)
  })
  it('onRotated', () => {
    let cnt = 0
    inst.onRotated.add(() => {
      cnt++
    })
    resourceManager.angle = Math.PI / 4
    expect(cnt).toBe(1)
  })
})
