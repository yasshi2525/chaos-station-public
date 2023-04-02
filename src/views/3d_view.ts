import { LogicalOffset, ProjectionManager } from '../behaviors/projection_manager'

export type ThreeDimensionalViewOption = {
  scene: g.Scene
  projectionManager: ProjectionManager
  baseWidth: number,
  baseHeight: number
} & LogicalOffset

export abstract class ThreeDimensionalView extends g.E {
  readonly onRotated: g.Trigger<number>
  protected readonly projectionManager: ProjectionManager
  private readonly logical: LogicalOffset
  protected readonly baseWidth: number
  protected readonly baseHeight: number

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
    this.baseWidth = opts.baseWidth
    this.baseHeight = opts.baseHeight
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

  get logicalSize () {
    return {
      logicalX: this.baseWidth / this.projectionManager.getTargetLayer().width * this.projectionManager.size.logicalX,
      logicalY: this.baseHeight / this.projectionManager.getTargetLayer().height * this.projectionManager.size.logicalY,
      logicalZ: 0
    }
  }

  contains (target: LogicalOffset) {
    return this.logicalOffset.logicalX - this.logicalSize.logicalX / 2 < target.logicalX &&
      target.logicalX < this.logicalOffset.logicalX + this.logicalSize.logicalX / 2 &&
      this.logicalOffset.logicalY - this.logicalSize.logicalY / 2 < target.logicalY &&
      target.logicalY < this.logicalOffset.logicalY + this.logicalSize.logicalY / 2
  }
}
