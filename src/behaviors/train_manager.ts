import { ResourceManager } from './resource_manager'
import { TrainView } from '../views/train_view'
import { ProjectionManager } from './projection_manager'

type TrainManagerOption = {
  scene: g.Scene
  resourceManager: ResourceManager
}

export class TrainManager {
  private readonly scene: g.Scene
  private readonly resourceManager: ResourceManager
  private readonly projectionManager: ProjectionManager
  private readonly trains: TrainView[]

  constructor (opts: TrainManagerOption) {
    this.scene = opts.scene
    this.resourceManager = opts.resourceManager
    this.projectionManager = this.resourceManager.getGroundResources()
    this.trains = []
  }

  start () {
    const platform = this.resourceManager.getPlatform()
    const train = new TrainView({
      scene: this.scene,
      projectionManager: this.projectionManager,
      baseWidth: 400,
      baseHeight: 100,
      doors: 2,
      logicalX: this.projectionManager.size.logicalX * 2,
      logicalY: platform.logicalOffset.logicalY + platform.logicalSize.logicalY / 2 +
        100 / this.projectionManager.getTargetLayer().height * this.projectionManager.size.logicalY / 2,
      logicalZ: 0,
      destination: platform.logicalOffset
    })
    this.resourceManager.addTrain(train)
    train.start()
  }

  add (view: TrainView) {
    this.trains.push(view)
  }
}
