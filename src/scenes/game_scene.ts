import { ResourceManager } from '../behaviors/resource_manager'
import { TooltipManager } from '../behaviors/tooltip_manager'
import { TooltipStairView } from '../views/tooltip_stair_view'

type GameSceneOption = {
  game: g.Game
}

export class GameScene extends g.Scene {
  constructor (opts: GameSceneOption) {
    super({
      ...opts,
      name: 'game'
    })
    this.onLoad.add(() => {
      const resourceManager = new ResourceManager({
        scene: this
      })
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
    })
  }
}
