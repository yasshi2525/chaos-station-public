import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type PlatformViewOption = ThreeDimensionalViewOption

export class PlatformView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: PlatformViewOption) {
    super(opts)
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: this.baseWidth,
      height: Math.cos(opts.projectionManager.angle) * this.baseHeight,
      cssColor: '#778899'
    })
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * this.baseHeight
      this.icon.modified()
    })
  }

  getBaseWidth () {
    return this.baseWidth
  }
}
