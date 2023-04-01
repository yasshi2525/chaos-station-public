import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PassengerView } from '../../src/views/passenger_view'
import { PassengerManager } from '../../src/behaviors/passenger_manager'

describe('passenger_view', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let passengerManager: PassengerManager
  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getPlatformResources()
    passengerManager = resourceManager.getPassengerResources()
  })
  it('onRotated', () => {
    const inst = new PassengerView({
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
    passengerManager.addSubject(inst, passengerManager.getStairs()[0])
    resourceManager.angle = Math.PI / 4
    expect(cnt).toBe(1)
  })
})
