import { ProjectionManager } from './projection_manager'
import { ResourceManager } from './resource_manager'

export type BehaviorManagerOption = {
  scene: g.Scene,
  resourceManager: ResourceManager,
  projectionManager: ProjectionManager
}

export abstract class BehaviorManager {
  protected readonly scene: g.Scene
  protected readonly targetLayer: g.E
  protected readonly resourceManager: ResourceManager
  protected readonly projectionManager: ProjectionManager

  protected constructor (opts: BehaviorManagerOption) {
    this.scene = opts.scene
    this.resourceManager = opts.resourceManager
    this.projectionManager = opts.projectionManager
    this.targetLayer = this.projectionManager.getTargetLayer()
  }

  abstract start (): void
}
