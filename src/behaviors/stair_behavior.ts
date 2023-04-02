import { ResourceManager } from './resource_manager'
import { BehaviorManager } from './behavior_manager'
import { StairView } from '../views/stair_view'
import { PassengerView } from '../views/passenger_view'
import { PlatformView } from '../views/platform_view'

type StairBehaviorOption = {
  scene: g.Scene,
  resourceManager: ResourceManager
}

const speed = 0.001

export class StairBehavior extends BehaviorManager {
  private readonly stairs: { stair: StairView, on: PlatformView }[]
  private readonly mapper: { stair: StairView, subjects: PassengerView[] }[]

  constructor (opts: StairBehaviorOption) {
    super({
      ...opts,
      projectionManager: opts.resourceManager.getPlatformResources()
    })
    this.stairs = []
    this.mapper = []
  }

  add (view: StairView, on: PlatformView) {
    this.stairs.push({
      stair: view,
      on
    })
    this.mapper.push({
      stair: view,
      subjects: []
    })
  }

  start () {
    this.scene.onUpdate.add(() => {
      this.stairs.forEach(({
        stair,
        on
      }) => {
        const subjects = this.mapper
          .find(m => m.stair === stair)!.subjects
        subjects.forEach((s) => {
          s.logicalOffset = {
            logicalX: s.logicalOffset.logicalX - speed,
            logicalY: s.logicalOffset.logicalY,
            logicalZ: stair.getLogicalZat(s.logicalOffset.logicalX - speed)
          }
        })
        subjects.filter(s => !stair.contains(s.logicalOffset))
          .forEach(s => {
            subjects.splice(subjects.indexOf(s), 1)
            this.resourceManager.getRiderBehavior()
              .notifyEnter(s, stair, on)
          })
      })
    })
  }

  notifySpawn (subject: PassengerView, on: StairView) {
    this.mapper.find(({ stair }) => stair === on)!.subjects.push(subject)
  }
}
