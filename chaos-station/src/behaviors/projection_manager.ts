import { ThreeDimensionalView } from '../views/3d_view'

export type LogicalOffset = {
  logicalX: number,
  logicalY: number,
  logicalZ: number
}

export type ProjectionManagerOption = {
  scene: g.Scene,
  targetLayer: g.E,
  logical: LogicalOffset
  angle: number
}

export class ProjectionManager {
  readonly onMove: g.Trigger<ThreeDimensionalView>
  private readonly scene: g.Scene
  private readonly targetLayer: g.E
  private readonly logical: LogicalOffset
  private readonly angle: number
  private readonly subjects: ThreeDimensionalView[]

  constructor (opts: ProjectionManagerOption) {
    this.scene = opts.scene
    this.targetLayer = opts.targetLayer
    this.logical = opts.logical
    this.angle = opts.angle
    this.subjects = []
    this.onMove = new g.Trigger()
    this.onMove.add(v => {
      this.subjects.splice(this.subjects.indexOf(v), 1)
      this.targetLayer.remove(v)
      this.insert(v)
    })
  }

  add (view: ThreeDimensionalView) {
    this.insert(view)
  }

  project (view: LogicalOffset) {
    // TODO: impl
    return {
      x: view.logicalX,
      y: view.logicalY
    }
  }

  reflect (view: g.CommonOffset) {
    // TODO: impl
    return {
      logicalX: view.x,
      logicalY: view.y,
      logicalZ: 0
    }
  }

  getSubjects () {
    return this.subjects
  }

  private insert (target: ThreeDimensionalView) {
    let after: ThreeDimensionalView | undefined
    for (let i = 0; i < this.subjects.length; i++) {
      if (target.logicalOffset.logicalY < this.subjects[i].logicalOffset.logicalY) {
        after = this.subjects[i]
        this.subjects.splice(i, 0, target)
        this.targetLayer.insertBefore(target, after)
        return
      }
    }
    this.subjects.push(target)
    this.targetLayer.append(target)
  }
}
