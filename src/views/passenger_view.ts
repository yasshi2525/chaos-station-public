import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type PassengerViewOption = ThreeDimensionalViewOption

const width = 20
const height = 40

export class PassengerView extends ThreeDimensionalView {
  static readonly width = width
  private readonly icon: g.E

  constructor (opts: PassengerViewOption) {
    super(opts)
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 1,
      width,
      height: height * Math.sin(opts.projectionManager.angle),
      cssColor: '#000000'
    })
    this.icon.append(new g.FilledRect({
      scene: this.scene,
      x: 1,
      y: 1,
      width: width - 2,
      height: height * Math.sin(opts.projectionManager.angle) - 2,
      cssColor: '#6495ed'
    }))
    this.onRotated.add(angle => {
      this.icon.height = Math.sin(angle) * height
      this.icon.children![0].height = Math.sin(angle) * height
      this.icon.modified()
    })
  }
}
