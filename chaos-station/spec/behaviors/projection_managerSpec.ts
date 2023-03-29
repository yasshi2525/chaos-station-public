import { ProjectionManager, ProjectionManagerOption } from '../../src/behaviors/projection_manager'
import { ThreeDimensionalView, ThreeDimensionalViewOption } from '../../src/views/3d_view'

class Simple3D extends ThreeDimensionalView {
  // eslint-disable-next-line no-useless-constructor
  constructor (opts: ThreeDimensionalViewOption) {
    super(opts)
  }
}

describe('projectionManager', () => {
  let opts: ProjectionManagerOption
  let targetLayer: g.E

  beforeEach(() => {
    targetLayer = new g.E({ scene })
    opts = {
      scene,
      targetLayer,
      logical: {
        logicalX: 1,
        logicalY: 1,
        logicalZ: 1
      },
      angle: 30
    }
  })

  it('sortした形で add される', () => {
    const inst = new ProjectionManager(opts)
    expect(inst.getSubjects()).toHaveLength(0)
    expect(targetLayer.children).toBeUndefined()

    const top = new Simple3D({
      scene,
      projectionManager: inst,
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    })
    inst.add(top)
    expect(inst.getSubjects()).toEqual([top])
    expect(targetLayer.children).toEqual([top])

    const bottom = new Simple3D({
      scene,
      projectionManager: inst,
      logicalX: 0,
      logicalY: 1,
      logicalZ: 0
    })
    inst.add(bottom)
    expect(inst.getSubjects()).toEqual([top, bottom])
    expect(targetLayer.children).toEqual([top, bottom])

    const center = new Simple3D({
      scene,
      projectionManager: inst,
      logicalX: 0,
      logicalY: 0.5,
      logicalZ: 0
    })
    inst.add(center)
    expect(inst.getSubjects()).toEqual([top, center, bottom])
    expect(targetLayer.children).toEqual([top, center, bottom])
  })

  it('move した際、順番が入れ替わる', () => {
    const inst = new ProjectionManager(opts)
    const list = [0, 0.5, 1].map(logicalY => new Simple3D({
      scene,
      projectionManager: inst,
      logicalX: 0,
      logicalY,
      logicalZ: 0
    }))
    list.forEach(s => inst.add(s))
    expect(inst.getSubjects()).toEqual(list)
    expect(targetLayer.children).toEqual(list)

    list[1].logicalOffset = {
      logicalX: 0,
      logicalY: 2,
      logicalZ: 0
    }
    expect(inst.getSubjects()).toEqual([list[0], list[2], list[1]])
    expect(targetLayer.children).toEqual([list[0], list[2], list[1]])
  })

  it('project - reflect', () => {
    const inst = new ProjectionManager(opts)
    const original = {
      logicalX: 0,
      logicalY: 0,
      logicalZ: 0
    }
    expect(inst.reflect(inst.project(original))).toEqual(original)
  })
})
