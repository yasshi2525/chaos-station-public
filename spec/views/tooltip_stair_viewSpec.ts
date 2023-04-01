import { TooltipStairView } from '../../src/views/tooltip_stair_view'
import { ResourceManager } from '../../src/behaviors/resource_manager'
import { TooltipManager } from '../../src/behaviors/tooltip_manager'

class SimpleTooltipStairView extends TooltipStairView {
  constructor (opts: {
    scene: g.Scene,
    resourceManager: ResourceManager,
    tooltipManager: TooltipManager
  }) {
    super({
      ...opts,
      x: 0,
      y: 0
    })
  }

  handleEvent (ev: g.CommonOffset) {
    super.handleEvent(ev)
  }
}

describe('tooltip_stair_view', () => {
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

  it('create', () => {
    const inst = new SimpleTooltipStairView({
      scene,
      resourceManager,
      tooltipManager
    })
    inst.handleEvent({
      x: 10,
      y: 10
    })
    expect(resourceManager.getPlatformResources().getSubjects()).toHaveLength(2)
  })
})
