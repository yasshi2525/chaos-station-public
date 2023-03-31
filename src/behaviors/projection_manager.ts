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
  private _angle: number
  private readonly subjects: ThreeDimensionalView[]

  constructor (opts: ProjectionManagerOption) {
    this.scene = opts.scene
    this.targetLayer = opts.targetLayer
    this.logical = opts.logical
    this._angle = opts.angle
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

  project (point3D: LogicalOffset) {
    return {
      x: point3D.logicalX / this.logical.logicalX * this.targetLayer.width,
      y: ((point3D.logicalY / this.logical.logicalY - 0.5) * Math.cos(this._angle) +
        point3D.logicalZ / this.logical.logicalZ * Math.sin(this._angle) + 0.5) * this.targetLayer.height
    }
  }

  reflect (view: g.CommonOffset) {
    // z値は0とする
    const y0 = (view.y / this.targetLayer.height - 0.5)
    return {
      logicalX: view.x / this.targetLayer.width * this.logical.logicalX,
      logicalY: (y0 * Math.cos(this._angle) + y0 * Math.sin(this._angle) * Math.tan(this._angle)) *
        this.logical.logicalY + this.logical.logicalY / 2,
      logicalZ: 0
    }
  }

  getSubjects () {
    return this.subjects
  }

  getTargetLayer () {
    return this.targetLayer
  }

  get angle () {
    return this._angle
  }

  set angle (theta: number) {
    this._angle = theta
    this.subjects.forEach(s => s.onRotated.fire(this._angle))
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
