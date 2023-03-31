import { ProjectionManager } from './projection_manager'
import { ResourceManager } from './resource_manager'
import { ThinPanelView } from '../views/thin_panel_view'

type DemoManagerOption = {
  scene: g.Scene,
  projectionManager: ProjectionManager
  resourceManager: ResourceManager
}

export class DemoManager {
  private readonly scene: g.Scene
  private readonly projectionManager: ProjectionManager
  private readonly resourceManager: ResourceManager

  constructor (opts: DemoManagerOption) {
    this.scene = opts.scene
    this.projectionManager = opts.projectionManager
    this.resourceManager = opts.resourceManager
  }

  start () {
    const space = this.projectionManager.getTargetLayer()
    space.x = g.game.width / 2
    space.y = g.game.height / 2
    space.anchorX = 0.5
    space.anchorY = 0.5
    space.width = 500
    space.height = 500
    space.modified()
    this.projectionManager.angle = 0

    const size = 50
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.resourceManager.addResourceOnPlatform(new ThinPanelView({
          scene: this.scene,
          projectionManager: this.projectionManager,
          logicalX: x / 10,
          logicalY: y / 10,
          logicalZ: 0,
          size: size - 4,
          type: 'x'
        }))
      }
    }

    let cnt = 0
    this.scene.onUpdate.add(() => {
      this.projectionManager.angle = cnt / g.game.fps / 5
      cnt++
    })
  }
}
