import { ProjectionManager } from './projection_manager'
import { ThreeDimensionalView } from '../views/3d_view'
import { PlatformView } from '../views/platform_view'
import { StairView } from '../views/stair_view'
import { PassengerManager } from './passenger_manager'

type ResourceManagerOption = {
  scene: g.Scene,
  angle: number
}

export class ResourceManager {
  private readonly scene: g.Scene
  private readonly groundLayer: g.E
  private readonly platformLayer: g.E
  private readonly platform: PlatformView
  private readonly groundResources: ProjectionManager
  private readonly platformResources: ProjectionManager
  private readonly passengerResources: PassengerManager
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
    this.passengerResources = new PassengerManager({
      scene: this.scene,
      resourceManager: this
    })
    this.platform = new PlatformView({
      scene: this.scene,
      width: this.groundLayer.width,
      height: this.groundLayer.height,
      projectionManager: this.groundResources,
      logicalX: 0.5,
      logicalY: 0.5,
      logicalZ: 0
    })
    this.addResourceOnGround(this.platform)
    this.addStair(new StairView({
      scene: this.scene,
      projectionManager: this.platformResources,
      logicalX: 0.75,
      logicalY: 0.25,
      logicalZ: 0
    }))
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

  addStair (view: StairView) {
    this.passengerResources.addSpawner(view)
    this.addResourceOnPlatform(view)
  }

  getGroundResources () {
    return this.groundResources
  }

  getPlatformResources () {
    return this.platformResources
  }

  getPassengerResources () {
    return this.passengerResources
  }

  getPlatform () {
    return this.platform
  }

  getTooltipLayer () {
    return this.tooltipLayer
  }
}
