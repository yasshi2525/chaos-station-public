import { DeployableView } from '../views/deployable_view'

type TooltipManagerOption = {
  scene: g.Scene
  targetLayer: g.E
}

export class TooltipManager {
  readonly onStart: g.Trigger<DeployableView>
  readonly onEnd: g.Trigger<DeployableView>
  private readonly scene: g.Scene
  private readonly targetLayer: g.E
  private readonly tooltips: DeployableView[]

  constructor (opts: TooltipManagerOption) {
    this.scene = opts.scene
    this.targetLayer = opts.targetLayer
    this.tooltips = []
    this.onStart = new g.Trigger()
    this.onEnd = new g.Trigger()
    this.onStart.add(v => this.disableOther(v))
    this.onEnd.add(v => this.enableOther(v))
  }

  add (view: DeployableView) {
    this.targetLayer.append(view)
    this.tooltips.push(view)
  }

  private disableOther (subject: DeployableView) {
    this.tooltips.filter(v => v !== subject).forEach(v => v.disable())
  }

  private enableOther (subject: DeployableView) {
    this.tooltips.filter(v => v !== subject).forEach(v => v.enable())
  }
}
