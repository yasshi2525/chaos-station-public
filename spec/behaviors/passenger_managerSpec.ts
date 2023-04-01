import { ResourceManager } from '../../src/behaviors/resource_manager'
import { StairView } from '../../src/views/stair_view'
import { ProjectionManager } from '../../src/behaviors/projection_manager'
import { PassengerManager } from '../../src/behaviors/passenger_manager'
import { PassengerView } from '../../src/views/passenger_view'

describe('passenger_manager', () => {
  let resourceManager: ResourceManager
  let projectionManager: ProjectionManager
  let inst: PassengerManager

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    projectionManager = resourceManager.getPlatformResources()
    inst = resourceManager.getPassengerResources()
  })

  it('start - 生成される', async () => {
    inst.start()
    await context.advance(2000)
    expect(inst.getSubject().length).toBeGreaterThan(0)
    expect(inst.getStairMapper()
      .find(m => m.stair === inst.getStairs()[0])!.subjects.length)
      .toBeGreaterThan(0)
  })

  it('addSpawner', () => {
    const before = inst.getStairs().length
    const stair = new StairView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    inst.addSpawner(stair)
    expect(inst.getStairs()).toHaveLength(before + 1)
    expect(inst.getStairMapper()).toHaveLength(before + 1)
  })

  it('addSubject', () => {
    inst.addSubject(new PassengerView({
      scene,
      projectionManager,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    }), inst.getStairs()[0])
    expect(inst.getSubject()).toHaveLength(1)
  })

  it('running', async () => {
    inst.start()
    await context.advance(100000)
    expect(inst.getSubject().length).toBeGreaterThan(0)
  })
})
