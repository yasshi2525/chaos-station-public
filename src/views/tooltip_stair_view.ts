import { DeployableView, DeployableViewOption } from './deployable_view'
import { StairView } from './stair_view'

type TooltipStairViewOption = Omit<DeployableViewOption, 'src'>

export class TooltipStairView extends DeployableView {
  constructor (opts: TooltipStairViewOption) {
    super({
      ...opts,
      src: '#a0522d'
    })
  }

  protected handleEvent (ev: g.CommonOffset) {
    const projectionManager = this.resourceManager.getPlatformResources()
    const offset = projectionManager.reflect(ev)
    const on = this.resourceManager.findPlatformOn(offset)
    if (on) {
      this.resourceManager.addStair(new StairView({
        scene: this.scene,
        projectionManager,
        ...offset
      }), on)
    }
  }
}
