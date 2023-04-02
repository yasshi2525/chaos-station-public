import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PlatformView } from '../../src/views/platform_view'
import { StairView } from '../../src/views/stair_view'
import { StairBehavior } from '../../src/behaviors/stair_behavior'
import { PassengerView } from '../../src/views/passenger_view'

describe('stair_behavior', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let inst: StairBehavior
  let platform: PlatformView
  let stair: StairView
  let passenger: PassengerView

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    inst = resourceManager.getStairBehavior()
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
    passenger = new PassengerView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    resourceManager.addPlatform(platform)
    resourceManager.addPassenger(passenger)
  })

  it('add', () => {
    expect(() => inst.add(stair, platform)).not.toThrow()
  })

  it('start', async () => {
    resourceManager.addStair(stair, platform)
    expect(() => inst.start()).not.toThrow()
    inst.notifySpawn(passenger, stair)
    await context.advance(2000)
  })

  it('notifySpawn', () => {
    resourceManager.addStair(stair, platform)
    expect(() => inst.notifySpawn(passenger, stair)).not.toThrow()
  })
})
