import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type ThinPanelViewOption = ThreeDimensionalViewOption & {
  size: number,
  type: 'x' | 'z'
}

export class ThinPanelView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: ThinPanelViewOption) {
    super(opts)
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: opts.size,
      height: opts.size,
      cssColor: '#98fb98',
      opacity: 0.25
    })
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * opts.size
      this.icon.opacity = 0.25 * Math.abs(Math.sin(angle)) + 0.25
      this.icon.modified()
    })
  }
}
