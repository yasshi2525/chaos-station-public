import { TooltipManager } from '../../src/behaviors/tooltip_manager'
import { DeployableView } from '../../src/views/deployable_view'
import { ResourceManager } from '../../src/behaviors/resource_manager'

class SimpleDeployable extends DeployableView {
  lastEvent?: g.CommonOffset

  constructor (opts: {
    scene: g.Scene,
    tooltipManager: TooltipManager,
    resourceManager: ResourceManager
  }) {
    super({
      ...opts,
      x: 0,
      y: 0,
      src: ''
    })
  }

  protected handleEvent (ev: g.CommonOffset) {
    this.lastEvent = ev
  }
}

describe('tooltip_manager', () => {
  let resourceManager: ResourceManager
  let tooltipManager: TooltipManager

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    tooltipManager = new TooltipManager({
      scene,
      targetLayer: resourceManager.getTooltipLayer()
    })
  })

  it('操作が始まると他は無効', () => {
    const subject = new SimpleDeployable({
      scene,
      resourceManager,
      tooltipManager
    })
    const other = new SimpleDeployable({
      scene,
      resourceManager,
      tooltipManager
    })
    tooltipManager.add(subject)
    tooltipManager.add(other)
    tooltipManager.onStart.fire(subject)
    expect(other.subject.touchable).toBe(false)
  })

  it('操作が終わると他は有効', () => {
    const subject = new SimpleDeployable({
      scene,
      resourceManager,
      tooltipManager
    })
    const other = new SimpleDeployable({
      scene,
      resourceManager,
      tooltipManager
    })
    tooltipManager.add(subject)
    tooltipManager.add(other)
    tooltipManager.onStart.fire(subject)
    tooltipManager.onEnd.fire(subject)
    expect(other.subject.touchable).toBe(true)
  })
})
