import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type StairViewOption = ThreeDimensionalViewOption & {
  width: number,
  height: number
}

export class StairView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: StairViewOption) {
    super(opts)
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: opts.width,
      height: opts.height,
      cssColor: '#000000'
    })
    this.icon.append(new g.FilledRect({
      scene: this.scene,
      x: 1,
      y: 1,
      width: opts.width - 2,
      height: opts.height - 2,
      cssColor: '#8b0000'
    }))
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * opts.height
      this.icon.children![0].height = Math.cos(angle) * opts.height
      this.icon.modified()
    })
  }
}
