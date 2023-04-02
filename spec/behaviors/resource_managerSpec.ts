import { ResourceManager } from '../../src/behaviors/resource_manager'
import { ThreeDimensionalView } from '../../src/views/3d_view'
import { ProjectionManager } from '../../src/behaviors/projection_manager'

class Simple3D extends ThreeDimensionalView {
  constructor (opts: {
    scene: g.Scene,
    projectionManager: ProjectionManager
  }) {
    super({
      ...opts,
      baseWidth: 100,
      baseHeight: 100,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
  }
}

describe('resource_manager', () => {
  it('create', () => {
    const inst = new ResourceManager({
      scene,
      angle: 0
    })
    expect(inst.getTooltipLayer()).toBeDefined()
    expect(inst.getGroundResources()).toBeDefined()
    expect(inst.getPlatformResources()).toBeDefined()
  })
  it('add', () => {
    const inst = new ResourceManager({
      scene,
      angle: 0
    })
    const child = new Simple3D({
      scene,
      projectionManager: inst.getPlatformResources()
    })
    inst.addResourceOnPlatform(child)
    expect(inst.getPlatformResources().getSubjects()).toHaveLength(1)
    expect(inst.getPlatformResources().getSubjects()[0]).toEqual(child)
  })
  it('angle', () => {
    const inst = new ResourceManager({
      scene,
      angle: 0
    })
    inst.angle = 0.5
    expect(inst.angle).toBe(0.5)
  })
})
