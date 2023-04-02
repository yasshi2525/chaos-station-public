import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type PlatformViewOption = ThreeDimensionalViewOption & {
  baseWidth: number,
  baseHeight: number
}

export class PlatformView extends ThreeDimensionalView {
  private readonly icon: g.E
  private readonly _baseWidth: number
  private readonly baseHeight: number

  constructor (opts: PlatformViewOption) {
    super(opts)
    this._baseWidth = opts.baseWidth
    this.baseHeight = opts.baseHeight
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: this._baseWidth,
      height: Math.cos(opts.projectionManager.angle) * this.baseHeight,
      cssColor: '#778899'
    })
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * this.baseHeight
      this.icon.modified()
    })
  }

  get baseWidth () {
    return this._baseWidth
  }

  get logicalSize () {
    return {
      logicalX: this._baseWidth / this.projectionManager.getTargetLayer().width * this.projectionManager.size.logicalX,
      logicalY: this.baseHeight / this.projectionManager.getTargetLayer().height * this.projectionManager.size.logicalY,
      logicalZ: 0
    }
  }
}
