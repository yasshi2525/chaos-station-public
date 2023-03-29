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
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
  }
}

describe('resource_manager', () => {
  it('create', () => {
    const inst = new ResourceManager({ scene })
    expect(inst.getTooltipLayer()).toBeDefined()
    expect(inst.getPlatformResources()).toBeDefined()
  })
  it('add', () => {
    const inst = new ResourceManager({ scene })
    const child = new Simple3D({
      scene,
      projectionManager: inst.getPlatformResources()
    })
    inst.addResourceOnPlatform(child)
    expect(inst.getPlatformResources().getSubjects()).toEqual([child])
  })
})
