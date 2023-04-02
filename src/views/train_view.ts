import { ThreeDimensionalView, ThreeDimensionalViewOption } from './3d_view'
import { LogicalOffset } from '../behaviors/projection_manager'

type TrainViewOption = ThreeDimensionalViewOption & {
  doors: number,
  destination: LogicalOffset
}

const doorWidth = 60
const doorHeight = 20
const acceleration = 0.0001
const initialVelocity = -0.01
const distanceForStop = initialVelocity * initialVelocity / (2 * acceleration)

export class TrainView extends ThreeDimensionalView {
  private readonly body: g.E
  private readonly doors: g.E[]
  private readonly steps: g.E[]
  private readonly destination: LogicalOffset
  private velocity: number
  private status: 'stopping' | 'opening' | 'stay' | 'closing' | 'starting'

  constructor (opts: TrainViewOption) {
    if (opts.logicalX - opts.destination.logicalX < distanceForStop) {
      opts.logicalX = opts.destination.logicalX + distanceForStop
    }
    super(opts)
    this.steps = []
    this.doors = []
    this.destination = opts.destination
    this.velocity = initialVelocity
    this.status = 'stopping'
    this.body = new g.FilledRect({
      scene: this.scene,
      parent: this,
      anchorX: 0.5,
      anchorY: 0.5,
      width: this.baseWidth,
      height: this.baseHeight * Math.cos(this.projectionManager.angle),
      cssColor: '#3cb371',
      opacity: 0.5
    })

    for (let i = 0; i < opts.doors; i++) {
      const band = this.baseWidth / opts.doors
      const center = (i + 0.5) * band
      this.steps.push(new g.FilledRect({
        scene: this.scene,
        parent: this.body,
        x: center - doorWidth / 2,
        width: doorWidth,
        height: doorHeight * Math.cos(this.projectionManager.angle),
        cssColor: '#008b8b',
        opacity: 0.5
      }))
      this.doors.push(new g.FilledRect({
        scene: this.scene,
        parent: this.body,
        x: center - doorWidth / 2,
        width: doorWidth,
        height: doorHeight * Math.cos(this.projectionManager.angle),
        cssColor: '#008b8b',
        opacity: 0.5
      }))
    }

    this.onRotated.add(angle => {
      this.body.height = Math.cos(angle) * this.baseHeight
      this.body.children!.forEach(d => {
        d.height = Math.cos(angle) * doorHeight
        d.modified()
      })
      this.body.modified()
    })
  }

  start () {
    this.onUpdate.add(() => {
      switch (this.status) {
        case 'stopping':
          if (this.logicalOffset.logicalX - this.destination.logicalX < distanceForStop) {
            this.velocity += acceleration
            if (this.velocity >= 0) {
              this.velocity = 0
              this.logicalOffset = {
                logicalX: this.destination.logicalX,
                logicalY: this.logicalOffset.logicalY,
                logicalZ: this.logicalOffset.logicalZ
              }
              this.status = 'opening'
              break
            }
          }
          this.logicalOffset = {
            logicalX: this.logicalOffset.logicalX + this.velocity,
            logicalY: this.logicalOffset.logicalY,
            logicalZ: this.logicalOffset.logicalZ
          }
          break
        case 'opening':
          this.doors.forEach(d => {
            d.width -= 1.5
            if (d.width < 0) {
              d.width = 0
              this.status = 'stay'
            }
            d.modified()
          })
      }
    })
  }
}
