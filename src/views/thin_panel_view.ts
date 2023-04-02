import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type ThinPanelViewOption = Omit<Omit<ThreeDimensionalViewOption, 'baseWidth'>, 'baseHeight'> & {
  size: number,
  type: 'x' | 'z'
}

export class ThinPanelView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: ThinPanelViewOption) {
    super({
      ...opts,
      baseWidth: opts.size,
      baseHeight: opts.size
    })
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: this.baseWidth,
      height: this.baseHeight,
      cssColor: '#98fb98',
      opacity: 0.25
    })
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * this.baseHeight
      this.icon.opacity = 0.25 * Math.abs(Math.sin(angle)) + 0.25
      this.icon.modified()
    })
  }
}
