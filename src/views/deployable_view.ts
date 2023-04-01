import { TooltipManager } from '../behaviors/tooltip_manager'
import { ResourceManager } from '../behaviors/resource_manager'

export type DeployableViewOption = {
  scene: g.Scene,
  x: number,
  y: number,
  src: string,
  tooltipManager: TooltipManager,
  resourceManager: ResourceManager
}

const width = 125
const height = 75
const disabledAlpha = 0.5
const defAlpha = 0.75
const pressedAlpha = 1.0
const subjectDefAlpha = 0.1
const subjectAlpha = 0.5

export abstract class DeployableView extends g.E {
  private readonly tooltipManager: TooltipManager
  protected readonly resourceManager: ResourceManager
  /**
   * ボタン
   * @private
   */
  private readonly _source: g.E
  /**
   * カーソルとなるオブジェクト
   * @private
   */
  private readonly _subject: g.E

  protected constructor (opts: DeployableViewOption) {
    super({
      ...opts,
      anchorX: 0.5,
      anchorY: 0.5,
      width,
      height
    })
    this.tooltipManager = opts.tooltipManager
    this.resourceManager = opts.resourceManager
    this._source = new g.FilledRect({
      scene: this.scene,
      parent: this,
      width,
      height,
      opacity: defAlpha,
      cssColor: opts.src
    })
    this._subject = new g.FilledRect({
      scene: this.scene,
      parent: this,
      width,
      height,
      opacity: subjectDefAlpha,
      cssColor: opts.src,
      touchable: true
    })

    let pid: number | undefined
    this._subject.onPointDown.add(e => {
      if (pid === undefined) {
        pid = e.pointerId
        this._source.opacity = pressedAlpha
        this._source.modified()
        this._subject.opacity = subjectAlpha
        this._subject.modified()
        this.tooltipManager.onStart.fire(this)
      }
    })
    this._subject.onPointMove.add(e => {
      if (pid === e.pointerId) {
        this._subject.x += e.prevDelta.x
        this._subject.y += e.prevDelta.y
        this._subject.modified()
      }
    })
    this._subject.onPointUp.add(e => {
      if (pid === e.pointerId) {
        const ev = this.resourceManager
          .getPlatformResources()
          .getTargetLayer()
          .globalToLocal(this._subject.localToGlobal(
            {
              x: this._subject.width / 2,
              y: this._subject.height / 2
            }))
        this._subject.moveTo({
          x: 0,
          y: 0
        })
        this.handleEvent(ev)
        this._source.opacity = defAlpha
        this._source.modified()
        this._subject.opacity = subjectDefAlpha
        this._subject.modified()
        this.tooltipManager.onEnd.fire(this)
        pid = undefined
      }
    })
  }

  disable () {
    this._source.opacity = disabledAlpha
    this._source.modified()
    this._subject.touchable = false
  }

  enable () {
    this._source.opacity = defAlpha
    this._source.modified()
    this._subject.touchable = true
  }

  get source () {
    return this._source
  }

  get subject () {
    return this._subject
  }

  protected abstract handleEvent (ev: g.CommonOffset): void
}
