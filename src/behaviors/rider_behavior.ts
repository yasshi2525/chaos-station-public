import { ResourceManager } from './resource_manager'
import { BehaviorManager } from './behavior_manager'
import { PlatformView } from '../views/platform_view'
import { PassengerView } from '../views/passenger_view'
import { LogicalOffset } from './projection_manager'
import { StairView } from '../views/stair_view'

type RiderBehaviorOption = {
  scene: g.Scene,
  resourceManager: ResourceManager
}

type RiderQueue = {
  enabled: boolean,
  queue: PassengerView[],
  offset: LogicalOffset
}

const queuePenalty = 0.01
const queueDistance = 2

export class RiderBehavior extends BehaviorManager {
  private readonly stairs: { stairs: StairView[], on: PlatformView }[]
  private readonly walkers: { list: PassengerView[], on: PlatformView }[]
  private readonly queues: { queues: RiderQueue[], on: PlatformView }[]

  constructor (opts: RiderBehaviorOption) {
    super({
      ...opts,
      projectionManager: opts.resourceManager.getPlatformResources()
    })
    this.stairs = []
    this.walkers = []
    this.queues = []
  }

  addPlatform (view: PlatformView) {
    this.stairs.push({
      stairs: [],
      on: view
    })
    this.walkers.push({
      list: [],
      on: view
    })
    const queues: RiderQueue[] = []
    const xLen = view.getBaseWidth() / PassengerView.baseWidth
    for (let x = 0; x < xLen; x++) {
      const offset = {
        logicalX: x / xLen * this.projectionManager.size.logicalX,
        logicalY: view.logicalOffset.logicalY + view.logicalSize.logicalY / 2 - 0.002,
        logicalZ: 0
      }
      queues.push({
        enabled: true,
        offset,
        queue: []
      })
    }
    this.queues.push({
      queues,
      on: view
    })
  }

  addStair (view: StairView, on: PlatformView) {
    this.stairs
      .find(s => s.on === on)!
      .stairs.push(view)
    this.queues
      .find(q => q.on === on)!.queues
      .filter(q => view.contains(q.offset))
      .forEach(q => {
        q.enabled = false
      })
  }

  notifyEnter (view: PassengerView, on: StairView, base: PlatformView) {
    this.walkers.find(w => w.on === base)!.list.push(view)
  }

  start () {
    this.scene.onUpdate.add(() => {
      this.walkers.forEach(({
        list,
        on
      }) => {
        list.forEach(subject => {
          const goal = this.findGoal(subject,
            this.queues.find(q => q.on === on)!.queues)

          // 目的地に近いなら、列に並ぶ
          if (g.Util.distanceBetweenOffsets({
            x: subject.logicalOffset.logicalX,
            y: subject.logicalOffset.logicalY
          }, {
            x: goal.offset.logicalX,
            y: goal.offset.logicalY
          }) < PassengerView.baseWidth / this.targetLayer.width * this.projectionManager.size.logicalX) {
            list.splice(list.indexOf(subject), 1)
            goal.queue.push(subject)
            return
          }

          // 列が出来ているなら、列に並ぼうとする
          if (goal.queue.length > 0) {
            const nearest = this.findNearestQueue(subject, goal)

            if (g.Util.distanceBetweenOffsets({
              x: subject.logicalOffset.logicalX,
              y: subject.logicalOffset.logicalY
            }, {
              x: nearest.logicalOffset.logicalX,
              y: nearest.logicalOffset.logicalY
            }) < PassengerView.baseWidth / this.targetLayer.width * this.projectionManager.size.logicalX * queueDistance) {
              list.splice(list.indexOf(subject), 1)
              goal.queue.push(subject)
            } else {
              this.walk(subject, nearest.logicalOffset)
            }
            return
          }

          // 列が出来ていないなら、目的地を目指そうとする
          this.walk(subject, goal.offset)
        })
      })
    })
  }

  private findGoal (subject: PassengerView, goals: RiderQueue[]) {
    return goals
      .filter(g => g.enabled)
      .reduce((prev, current) => {
        const prevDist = g.Util.distanceBetweenOffsets(
          {
            x: subject.logicalOffset.logicalX,
            y: subject.logicalOffset.logicalY
          },
          {
            x: prev.offset.logicalX,
            y: prev.offset.logicalY
          }
        )
        const currentDist = g.Util.distanceBetweenOffsets(
          {
            x: subject.logicalOffset.logicalX,
            y: subject.logicalOffset.logicalY
          },
          {
            x: current.offset.logicalX,
            y: current.offset.logicalY
          }
        )
        return prevDist + (prev.queue.length * queuePenalty) <
        currentDist + (current.queue.length * queuePenalty)
          ? prev
          : current
      })
  }

  private findNearestQueue (subject: PassengerView, goal: RiderQueue) {
    return goal.queue.reduce((prev, current) => {
      const prevDist = g.Util.distanceBetweenOffsets(
        {
          x: subject.logicalOffset.logicalX,
          y: subject.logicalOffset.logicalY
        },
        {
          x: prev.logicalOffset.logicalX,
          y: prev.logicalOffset.logicalY
        }
      )
      const currentDist = g.Util.distanceBetweenOffsets(
        {
          x: subject.logicalOffset.logicalX,
          y: subject.logicalOffset.logicalY
        },
        {
          x: current.logicalOffset.logicalX,
          y: current.logicalOffset.logicalY
        }
      )
      return prevDist < currentDist ? prev : current
    })
  }

  private walk (subject: PassengerView, destination: LogicalOffset) {
    const theta = Math.atan2(
      destination.logicalY - subject.logicalOffset.logicalY,
      destination.logicalX - subject.logicalOffset.logicalX)
    subject.logicalOffset = {
      logicalX: subject.logicalOffset.logicalX + 0.01 * Math.cos(theta),
      logicalY: subject.logicalOffset.logicalY + 0.01 * Math.sin(theta),
      logicalZ: 0
    }
  }
}
