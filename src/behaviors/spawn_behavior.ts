import { ResourceManager } from './resource_manager'
import { BehaviorManager } from './behavior_manager'
import { StairView } from '../views/stair_view'
import { PassengerView } from '../views/passenger_view'

type SpawnBehaviorOption = {
  scene: g.Scene,
  resourceManager: ResourceManager
}

const interval = 500

export class SpawnBehavior extends BehaviorManager {
  private readonly spawners: StairView[]

  constructor (opts: SpawnBehaviorOption) {
    super({
      ...opts,
      projectionManager: opts.resourceManager.getPlatformResources()
    })
    this.spawners = []
  }

  add (view: StairView) {
    this.spawners.push(view)
  }

  start () {
    this.scene.setInterval(() => {
      const on = this.spawners[Math.floor(g.game.random.generate() * this.spawners.length)]
      const logicalX = on.logicalOffset.logicalX + on.logicalSize.logicalX * (g.game.random.generate() - 0.5)
      const logicalY = on.logicalOffset.logicalY + (g.game.random.generate() - 0.5) * on.logicalSize.logicalY
      const logicalZ = on.getLogicalZat(logicalX)
      const subject = new PassengerView({
        scene: this.scene,
        projectionManager: this.projectionManager,
        logicalX,
        logicalY,
        logicalZ
      })
      this.resourceManager.addPassenger(subject)
      this.resourceManager.getStairBehavior().notifySpawn(subject, on)
    }, interval)
  }
}
