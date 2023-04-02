import { ProjectionManager } from './projection_manager'
import { ThinPanelView } from '../views/thin_panel_view'
import { ResourceManager } from './resource_manager'

type DemoManagerOption = {
  scene: g.Scene,
  resourceManager: ResourceManager
  grid: boolean
}

export class DemoManager {
  private readonly scene: g.Scene
  private readonly resourceManager: ResourceManager
  private readonly grid: boolean

  constructor (opts: DemoManagerOption) {
    this.scene = opts.scene
    this.resourceManager = opts.resourceManager
    this.grid = opts.grid
  }

  start () {
    let projectionManager: ProjectionManager | undefined
    if (this.grid) {
      const targetLayer = new g.E({
        scene: this.scene,
        parent: this.scene,
        width: 500,
        height: 500,
        x: g.game.width - 500
      })
      // eslint-disable-next-line prefer-const
      projectionManager = new ProjectionManager({
        scene: this.scene,
        angle: this.resourceManager.angle,
        targetLayer,
        logical: {
          logicalX: 1,
          logicalY: 1,
          logicalZ: 1
        }
      })
      const size = 50
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          projectionManager.add(new ThinPanelView({
            scene: this.scene,
            projectionManager,
            logicalX: x / 10,
            logicalY: y / 10,
            logicalZ: 0,
            size: size - 4,
            type: 'x'
          }))
        }
      }
    }

    const minAngle = 0
    const maxAngle = Math.PI * 0.4
    let velocity = 1 / g.game.fps / (2 * Math.PI)
    this.scene.onUpdate.add(() => {
      this.resourceManager.angle += velocity
      if (projectionManager) {
        projectionManager.angle += velocity
      }
      if ((velocity > 0 && this.resourceManager.angle > maxAngle) ||
        (velocity < 0 && this.resourceManager.angle < minAngle)) {
        velocity = -velocity
      }
    })
  }
}
