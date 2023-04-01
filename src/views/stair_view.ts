import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'
import { LogicalOffset } from '../behaviors/projection_manager'

type StairViewOption = ThreeDimensionalViewOption

const width = 150
const height = 100
const logicalLength = 0.1 // 高さ

export class StairView extends ThreeDimensionalView {
  private readonly icon: g.E

  constructor (opts: StairViewOption) {
    super(opts)
    this.icon = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width,
      height: height * Math.cos(opts.projectionManager.angle),
      cssColor: '#000000',
      opacity: 0.5
    })
    this.icon.append(new g.FilledRect({
      scene: this.scene,
      x: 1,
      y: 1,
      width: width - 2,
      height: height * Math.cos(opts.projectionManager.angle) - 2,
      cssColor: '#8b0000',
      opacity: 0.5
    }))
    this.onRotated.add(angle => {
      this.icon.height = Math.cos(angle) * height
      this.icon.children![0].height = Math.cos(angle) * height - 2
      this.icon.modified()
    })
  }

  contains (target: LogicalOffset) {
    return this.logicalOffset.logicalX - this.logicalSize.logicalX / 2 < target.logicalX &&
      target.logicalX < this.logicalOffset.logicalX + this.logicalSize.logicalX / 2 &&
      this.logicalOffset.logicalY - this.logicalSize.logicalY / 2 < target.logicalY &&
      target.logicalY < this.logicalOffset.logicalY + this.logicalSize.logicalY / 2
  }

  getLogicalZat (logicalX: number) {
    return (logicalX - (this.logicalOffset.logicalX - this.logicalSize.logicalX / 2)) / this.logicalSize.logicalX * this.logicalSize.logicalZ
  }

  get logicalSize () {
    return {
      logicalX: width / this.projectionManager.getTargetLayer().width * this.projectionManager.size.logicalX,
      logicalY: height / this.projectionManager.getTargetLayer().height * this.projectionManager.size.logicalY,
      logicalZ: logicalLength
    }
  }
}
