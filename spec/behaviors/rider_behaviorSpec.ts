import { RiderBehavior } from '../../src/behaviors/rider_behavior'
import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PlatformView } from '../../src/views/platform_view'
import { StairView } from '../../src/views/stair_view'
import { PassengerView } from '../../src/views/passenger_view'

describe('rider_behavior', () => {
  let inst: RiderBehavior
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let platform: PlatformView
  let stair: StairView
  let passenger: PassengerView

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    inst = resourceManager.getRiderBehavior()
    projectionManager = resourceManager.getPlatformResources()
    platform = new PlatformView({
      scene,
      projectionManager,
      baseWidth: 100,
      baseHeight: 100,
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
  })

  it('addPlatform (goal) 作成', () => {
    expect(() => inst.addPlatform(platform)).not.toThrow()
  })

  it('addStair', () => {
    inst.addPlatform(platform)
    expect(() => inst.addStair(stair, platform)).not.toThrow()
  })

  it('notifyEnter', () => {
    inst.addPlatform(platform)
    inst.addStair(stair, platform)
    expect(() => inst.notifyEnter(passenger, stair, platform)).not.toThrow()
  })

  it.each([2, 200])('start (crowded)', async (n) => {
    resourceManager.addPlatform(platform)
    resourceManager.addStair(stair, platform)
    const passengers = []
    for (let i = 0; i < n; i++) {
      passengers.push(new PassengerView({
        scene,
        projectionManager,
        logicalX: i / n * stair.logicalSize.logicalX,
        logicalY: 0,
        logicalZ: 0
      }))
    }
    passengers.forEach(p => {
      resourceManager.addPassenger(p)
      inst.notifyEnter(p, stair, platform)
    })
    inst.start()
    await context.advance(n * 1000)
    passengers.forEach((p, i) => expect(p.logicalOffset).not.toEqual({
      logicalX: i / n * stair.logicalSize.logicalX,
      logicalY: 0,
      logicalZ: 0
    }))
  })
})
