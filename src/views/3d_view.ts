import { LogicalOffset, ProjectionManager } from '../behaviors/projection_manager'

export type ThreeDimensionalViewOption = {
  scene: g.Scene
  projectionManager: ProjectionManager
} & LogicalOffset

export abstract class ThreeDimensionalView extends g.E {
  readonly onRotated: g.Trigger<number>
  protected readonly projectionManager: ProjectionManager
  private readonly logical: LogicalOffset

  protected constructor (opts: ThreeDimensionalViewOption) {
    super({
      ...opts,
      ...opts.projectionManager.project(opts)
    })
    this.onRotated = new g.Trigger()
    this.logical = {
      logicalX: opts.logicalX,
      logicalY: opts.logicalY,
      logicalZ: opts.logicalZ
    }
    this.projectionManager = opts.projectionManager
    this.onRotated.add(() => {
      const {
        x,
        y
      } = this.projectionManager.project(this.logical)
      this.x = x
      this.y = y
      this.modified()
      this.projectionManager.onMove.fire(this)
    })
  }

  set logicalOffset (v: LogicalOffset) {
    this.logical.logicalX = v.logicalX
    this.logical.logicalY = v.logicalY
    this.logical.logicalZ = v.logicalZ
    const {
      x,
      y
    } = this.projectionManager.project(this.logical)
    this.x = x
    this.y = y
    this.modified()
    this.projectionManager.onMove.fire(this)
  }

  get logicalOffset () {
    return this.logical
  }
}
