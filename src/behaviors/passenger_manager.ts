import { ResourceManager } from './resource_manager'
import { LogicalOffset, ProjectionManager } from './projection_manager'
import { StairView } from '../views/stair_view'
import { PassengerView } from '../views/passenger_view'

type PassengerManagerOption = {
  scene: g.Scene
  resourceManager: ResourceManager
}

export class PassengerManager {
  private readonly scene: g.Scene
  private readonly targetLayer: g.E
  private readonly resourceManager: ResourceManager
  private readonly projectionManager: ProjectionManager
  private readonly spawners: StairView[]
  private readonly subjects: PassengerView[]
  private readonly stairMapper: { stair: StairView, subjects: PassengerView[] }[]
  private readonly platformMapper: PassengerView[]
  private readonly rideQueue: { enabled: boolean, queue: PassengerView[], offset: LogicalOffset }[]

  constructor (opts: PassengerManagerOption) {
    this.scene = opts.scene
    this.resourceManager = opts.resourceManager
    this.projectionManager = this.resourceManager.getPlatformResources()
    this.targetLayer = this.projectionManager.getTargetLayer()
    this.spawners = []
    this.subjects = []
    this.stairMapper = []
    this.rideQueue = []
    this.platformMapper = []
  }

  addSpawner (view: StairView) {
    this.spawners.push(view)
    this.stairMapper.push({
      stair: view,
      subjects: []
    })
  }

  addSubject (view: PassengerView, on: StairView) {
    this.stairMapper.find(m => m.stair === on)!.subjects.push(view)
    this.subjects.push(view)
    this.resourceManager.addResourceOnPlatform(view)
  }

  start () {
    const platform = this.resourceManager.getPlatform()
    const xLen = platform.baseWidth / PassengerView.width
    for (let x = 0; x < xLen; x++) {
      const offset = {
        logicalX: x / xLen * this.projectionManager.size.logicalX,
        logicalY: platform.logicalOffset.logicalY + platform.logicalSize.logicalY / 2 - 0.002,
        logicalZ: 0
      }
      this.rideQueue.push({
        enabled: !this.spawners.some(s => s.contains(offset)),
        offset,
        queue: []
      })
    }

    this.scene.setInterval(() => {
      this.spawners.forEach(src => {
        const logicalX = src.logicalOffset.logicalX + src.logicalSize.logicalX * (g.game.random.generate() - 0.5)
        const logicalY = src.logicalOffset.logicalY + (g.game.random.generate() - 0.5) * src.logicalSize.logicalY
        const logicalZ = src.getLogicalZat(logicalX)
        this.addSubject(new PassengerView({
          scene: this.scene,
          projectionManager: this.projectionManager,
          logicalX,
          logicalY,
          logicalZ
        }), src)
      })
    }, 500)

    this.scene.onUpdate.add(() => {
      this.stairMapper.forEach(({
        stair,
        subjects
      }) => {
        subjects.forEach((s) => {
          s.logicalOffset = {
            logicalX: s.logicalOffset.logicalX - 0.001,
            logicalY: s.logicalOffset.logicalY,
            logicalZ: stair.getLogicalZat(s.logicalOffset.logicalX - 0.001)
          }
        })
        subjects.filter(s => !stair.contains(s.logicalOffset))
          .forEach(s => {
            subjects.splice(subjects.indexOf(s), 1)
            this.platformMapper.push(s)
          })
      })
    })

    this.scene.onUpdate.add(() => {
      this.platformMapper.forEach(s => {
        if (this.rideQueue.find(q => q.queue.includes(s))) {
          return
        }
        const goal = this.rideQueue
          .filter(q => q.enabled)
          .reduce((prev, current) => {
            const prevDist = g.Util.distanceBetweenOffsets(
              {
                x: s.logicalOffset.logicalX,
                y: s.logicalOffset.logicalY
              },
              {
                x: prev.offset.logicalX,
                y: prev.offset.logicalY
              }
            )
            const currentDist = g.Util.distanceBetweenOffsets(
              {
                x: s.logicalOffset.logicalX,
                y: s.logicalOffset.logicalY
              },
              {
                x: current.offset.logicalX,
                y: current.offset.logicalY
              }
            )
            return prevDist + (prev.queue.length * 0.01) < currentDist + (current.queue.length * 0.01) ? prev : current
          })

        if (g.Util.distanceBetweenOffsets({
          x: s.logicalOffset.logicalX,
          y: s.logicalOffset.logicalY
        }, {
          x: goal.offset.logicalX,
          y: goal.offset.logicalY
        }) < PassengerView.width / this.targetLayer.width * this.projectionManager.size.logicalX) {
          goal.queue.push(s)
          return
        }

        if (goal.queue.length > 0) {
          const nearest = goal.queue.reduce((prev, current) => {
            const prevDist = g.Util.distanceBetweenOffsets(
              {
                x: s.logicalOffset.logicalX,
                y: s.logicalOffset.logicalY
              },
              {
                x: prev.logicalOffset.logicalX,
                y: prev.logicalOffset.logicalY
              }
            )
            const currentDist = g.Util.distanceBetweenOffsets(
              {
                x: s.logicalOffset.logicalX,
                y: s.logicalOffset.logicalY
              },
              {
                x: current.logicalOffset.logicalX,
                y: current.logicalOffset.logicalY
              }
            )
            return prevDist < currentDist ? prev : current
          })

          if (g.Util.distanceBetweenOffsets({
            x: s.logicalOffset.logicalX,
            y: s.logicalOffset.logicalY
          }, {
            x: nearest.logicalOffset.logicalX,
            y: nearest.logicalOffset.logicalY
          }) < PassengerView.width / this.targetLayer.width * this.projectionManager.size.logicalX * 4) {
            goal.queue.push(s)
            return
          }
        }

        const theta = Math.atan2(
          goal.offset.logicalY - s.logicalOffset.logicalY,
          goal.offset.logicalX - s.logicalOffset.logicalX)
        s.logicalOffset = {
          logicalX: s.logicalOffset.logicalX + 0.01 * Math.cos(theta),
          logicalY: s.logicalOffset.logicalY + 0.01 * Math.sin(theta),
          logicalZ: 0
        }
      })
    })
  }

  getStairs () {
    return this.spawners
  }

  getSubject () {
    return this.subjects
  }

  getStairMapper () {
    return this.stairMapper
  }
}
