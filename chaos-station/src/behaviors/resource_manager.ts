import { ProjectionManager } from './projection_manager'
import { ThreeDimensionalView } from '../views/3d_view'

type ResourceManagerOption = {
  scene: g.Scene
}

export class ResourceManager {
  private readonly scene: g.Scene
  private readonly platformLayer: g.E
  private readonly platformResources: ProjectionManager
  private readonly tooltipLayer: g.E

  constructor (opts: ResourceManagerOption) {
    this.scene = opts.scene
    this.platformLayer = new g.E({
      scene: this.scene,
      parent: this.scene
    })
    this.tooltipLayer = new g.E({
      scene: this.scene,
      parent: this.scene
    })
    this.platformResources = new ProjectionManager({
      scene: this.scene,
      targetLayer: this.platformLayer,
      angle: 30,
      logical: {
        logicalX: 1,
        logicalY: 1,
        logicalZ: 1
      }
    })
  }

  addResourceOnPlatform (view: ThreeDimensionalView) {
    this.platformResources.add(view)
  }

  getPlatformResources () {
    return this.platformResources
  }

  getTooltipLayer () {
    return this.tooltipLayer
  }
}
