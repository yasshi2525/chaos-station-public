import { ResourceManager } from './resource_manager'
import { TrainView } from '../views/train_view'
import { BehaviorManager } from './behavior_manager'
import { PlatformView } from '../views/platform_view'

type TrainBehaviorOption = {
  scene: g.Scene
  resourceManager: ResourceManager
}

export class TrainBehavior extends BehaviorManager {
  private readonly trains: { list: TrainView[], destination: PlatformView }[]

  constructor (opts: TrainBehaviorOption) {
    super({
      ...opts,
      projectionManager: opts.resourceManager.getGroundResources()
    })
    this.trains = []
  }

  addPlatform (view: PlatformView) {
    const train = new TrainView({
      scene: this.scene,
      projectionManager: this.projectionManager,
      baseWidth: 400,
      baseHeight: 100,
      doors: 2,
      logicalX: this.projectionManager.size.logicalX * 2,
      logicalY: view.logicalOffset.logicalY + view.logicalSize.logicalY / 2 +
        100 / this.projectionManager.getTargetLayer().height * this.projectionManager.size.logicalY / 2,
      logicalZ: 0,
      destination: view.logicalOffset
    })
    this.trains.push({
      destination: view,
      list: [train]
    })
    this.resourceManager.addTrain(train, view)
    train.start()
  }

  start () {
  }
}
