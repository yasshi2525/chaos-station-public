import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'

type StairViewOption = Omit<Omit<ThreeDimensionalViewOption, 'baseWidth'>, 'baseHeight'>

const baseWidth = 150
const baseHeight = 100
const logicalLength = 0.25 // 高さ

export class StairView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: StairViewOption) {
    super({
      ...opts,
      baseWidth,
      baseHeight
    })
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: this.baseWidth,
      height: this.baseHeight * Math.cos(this.projectionManager.angle),
      cssColor: '#000000',
      opacity: 0.5
    })
    this.icon.append(new g.FilledRect({
      scene: this.scene,
      x: 1,
      y: 1,
      width: this.baseWidth - 2,
      height: this.baseHeight * Math.cos(this.projectionManager.angle) - 2,
      cssColor: '#8b0000',
      opacity: 0.5
    }))
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * this.baseHeight
      this.icon.children![0].height = Math.cos(angle) * this.baseHeight - 2
      this.icon.modified()
    })
  }

  getLogicalZat (logicalX: number) {
    return (logicalX - (this.logicalOffset.logicalX - this.logicalSize.logicalX / 2)) / this.logicalSize.logicalX * this.logicalSize.logicalZ
  }

  get logicalSize () {
    return {
      ...super.logicalSize,
      logicalZ: logicalLength
    }
  }
}
