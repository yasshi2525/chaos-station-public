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
    this.resourceManager.addResourceOnPlatform(new StairView({
      scene: this.scene,
      projectionManager,
      width: this.width,
      height: this.height,
      ...projectionManager.reflect(ev)
    }))
  }
}
