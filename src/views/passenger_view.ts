import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type PassengerViewOption = Omit<Omit<ThreeDimensionalViewOption, 'baseWidth'>, 'baseHeight'>

const baseWidth = 20
const baseHeight = 40

export class PassengerView extends ThreeDimensionalView {
  static readonly baseWidth = baseWidth
  private readonly icon: g.E

  constructor (opts: PassengerViewOption) {
    super({
      ...opts,
      baseWidth,
      baseHeight
    })
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 1,
      width: this.baseWidth,
      height: this.baseHeight * Math.sin(this.projectionManager.angle),
      cssColor: '#000000'
    })
    this.icon.append(new g.FilledRect({
      scene: this.scene,
      x: 1,
      y: 1,
      width: this.baseWidth - 2,
      height: this.baseHeight * Math.sin(opts.projectionManager.angle) - 2,
      cssColor: '#6495ed'
    }))
    this.onRotated.add(angle => {
      this.icon.height = Math.sin(angle) * this.baseHeight
      this.icon.children![0].height = Math.sin(angle) * this.baseHeight
      this.icon.children![0].modified()
      this.icon.modified()
    })
  }
}
