import { ResourceManager } from '../behaviors/resource_manager'
import { TooltipManager } from '../behaviors/tooltip_manager'
import { TooltipStairView } from '../views/tooltip_stair_view'
import { DemoManager } from '../behaviors/demo_manager'
import { DebugOption } from '../parameterObject'

type GameSceneOption = {
  game: g.Game,
  debug: DebugOption
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
      if (opts.debug.rotate) {
        // eslint-disable-next-line prefer-const
        demoManager = new DemoManager({
          scene: this,
          resourceManager,
          grid: opts.debug.grid
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
      demoManager?.start()
      resourceManager.start()
    })
  }
}
