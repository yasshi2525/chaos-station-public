import { LogicalOffset, ProjectionManager } from './projection_manager'
import { ThreeDimensionalView } from '../views/3d_view'
import { PlatformView } from '../views/platform_view'
import { StairView } from '../views/stair_view'
import { TrainView } from '../views/train_view'
import { TrainBehavior } from './train_behavior'
import { SpawnBehavior } from './spawn_behavior'
import { StairBehavior } from './stair_behavior'
import { PassengerView } from '../views/passenger_view'
import { RiderBehavior } from './rider_behavior'
import { BehaviorManager } from './behavior_manager'

type ResourceManagerOption = {
  scene: g.Scene,
  angle: number
}

export class ResourceManager {
  private readonly scene: g.Scene
  private readonly groundLayer: g.E
  private readonly platformLayer: g.E
  private readonly groundResources: ProjectionManager
  private readonly platformResources: ProjectionManager
  private readonly platforms: PlatformView[]

  private readonly behaviors: BehaviorManager[]
  private readonly spawnBehavior: SpawnBehavior
  private readonly stairBehavior: StairBehavior
  private readonly trainBehavior: TrainBehavior
  private readonly riderBehavior: RiderBehavior
  private readonly tooltipLayer: g.E
  private _angle: number

  constructor (opts: ResourceManagerOption) {
    this.scene = opts.scene
    this._angle = opts.angle
    const layerOpts = {
      scene: this.scene,
      parent: this.scene,
      x: g.game.width / 2,
      y: g.game.height / 2,
      width: g.game.width / 2,
      height: g.game.height / 4,
      anchorX: 0.5,
      anchorY: 0.5
    }
    this.groundLayer = new g.E(layerOpts)
    this.platformLayer = new g.E(layerOpts)
    this.tooltipLayer = new g.E({
      scene: this.scene,
      parent: this.scene
    })
    this.platforms = []

    const resourceOpts = {
      scene: this.scene,
      angle: this._angle,
      logical: {
        logicalX: 1,
        logicalY: 1,
        logicalZ: 1
      }
    }
    this.groundResources = new ProjectionManager({
      targetLayer: this.groundLayer,
      ...resourceOpts
    })
    this.platformResources = new ProjectionManager({
      targetLayer: this.platformLayer,
      ...resourceOpts
    })

    this.behaviors = []
    const behaviorOpts = {
      scene: this.scene,
      resourceManager: this
    }

    this.trainBehavior = new TrainBehavior(behaviorOpts)
    this.behaviors.push(this.trainBehavior)

    this.spawnBehavior = new SpawnBehavior(behaviorOpts)
    this.behaviors.push(this.spawnBehavior)

    this.stairBehavior = new StairBehavior(behaviorOpts)
    this.behaviors.push(this.stairBehavior)

    this.riderBehavior = new RiderBehavior(behaviorOpts)
    this.behaviors.push(this.riderBehavior)
  }

  get angle () {
    return this._angle
  }

  set angle (v: number) {
    this.groundResources.angle = v
    this.platformResources.angle = v
    this._angle = v
  }

  addResourceOnGround (view: ThreeDimensionalView) {
    this.groundResources.add(view)
  }

  addResourceOnPlatform (view: ThreeDimensionalView) {
    this.platformResources.add(view)
  }

  addPlatform (view: PlatformView) {
    this.platforms.push(view)
    this.riderBehavior.addPlatform(view)
    this.trainBehavior.addPlatform(view)
    this.addResourceOnGround(view)
  }

  addStair (view: StairView, on: PlatformView) {
    this.spawnBehavior.add(view)
    this.stairBehavior.add(view, on)
    this.riderBehavior.addStair(view, on)
    this.addResourceOnPlatform(view)
  }

  addTrain (view: TrainView, destination: PlatformView) {
    this.addResourceOnGround(view)
  }

  addPassenger (view: PassengerView) {
    this.addResourceOnPlatform(view)
  }

  getGroundResources () {
    return this.groundResources
  }

  getPlatformResources () {
    return this.platformResources
  }

  getTrainBehavior () {
    return this.trainBehavior
  }

  getSpawnBehavior () {
    return this.spawnBehavior
  }

  getStairBehavior () {
    return this.stairBehavior
  }

  getRiderBehavior () {
    return this.riderBehavior
  }

  getTooltipLayer () {
    return this.tooltipLayer
  }

  start () {
    this.behaviors.forEach(b => b.start())

    const platform = new PlatformView({
      scene: this.scene,
      baseWidth: this.groundLayer.width,
      baseHeight: this.groundLayer.height,
      projectionManager: this.groundResources,
      logicalX: 0.5,
      logicalY: 0.5,
      logicalZ: 0
    })
    this.addPlatform(platform)

    this.addStair(new StairView({
      scene: this.scene,
      projectionManager: this.platformResources,
      logicalX: 0.75,
      logicalY: 0.35,
      logicalZ: 0
    }), platform)
  }

  findPlatformOn (loc: LogicalOffset) {
    return this.platforms.find(p => p.contains(loc))
  }
}
