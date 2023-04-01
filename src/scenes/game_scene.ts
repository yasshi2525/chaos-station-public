import { ResourceManager } from '../behaviors/resource_manager'
import { TooltipManager } from '../behaviors/tooltip_manager'
import { TooltipStairView } from '../views/tooltip_stair_view'
import { DemoManager } from '../behaviors/demo_manager'

type GameSceneOption = {
  game: g.Game,
  debug: boolean
}

export class GameScene extends g.Scene {
  constructor (opts: GameSceneOption) {
    super({
      ...opts,
      name: 'game'
    })
    this.onLoad.add(() => {
      const resourceManager = new ResourceManager({
        scene: this,
        angle: Math.PI / 4
      })
      let demoManager: DemoManager | undefined
      if (opts.debug) {
        // eslint-disable-next-line prefer-const
        demoManager = new DemoManager({
          scene: this,
          resourceManager,
          projectionManager: resourceManager.getPlatformResources()
        })
      }
      const tooltipManager = new TooltipManager({
        scene: this,
        targetLayer: resourceManager.getTooltipLayer()
      })
      tooltipManager.add(new TooltipStairView({
        scene: this,
        resourceManager,
        tooltipManager,
        x: 200,
        y: 200
      }))
      const passengerManager = resourceManager.getPassengerResources()

      demoManager?.start()
      passengerManager.start()
    })
  }
}
