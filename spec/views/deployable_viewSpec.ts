import { DeployableView } from '../../src/views/deployable_view'
import { TooltipManager } from '../../src/behaviors/tooltip_manager'
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
      src: 'dummy'
    })
  }

  protected handleEvent (ev: g.CommonOffset): void {
    this.lastEvent = ev
  }
}

describe('deployable_view', () => {
  let resourceManager: ResourceManager
  let tooltipManager: TooltipManager
  let inst: SimpleDeployable

  beforeEach(() => {
    resourceManager = new ResourceManager({
      scene,
      angle: 0
    })
    tooltipManager = new TooltipManager({
      scene,
      targetLayer: resourceManager.getTooltipLayer()
    })
    inst = new SimpleDeployable({
      scene,
      resourceManager,
      tooltipManager
    })
    tooltipManager.add(inst)
  })

  it('fire onStart - down', () => {
    let count = 0
    tooltipManager.onStart.add(() => {
      count++
    })
    client.sendPointDown(10, 10, 1)
    context.step()
    expect(count).toBe(1)
  })

  it('move', () => {
    client.sendPointDown(10, 10, 1)
    client.sendPointMove(20, 20, 1)
    context.step()
    expect(inst.subject).toMatchObject({
      x: 10,
      y: 10
    })
  })

  it('fire onEnd - up', () => {
    let count = 0
    tooltipManager.onEnd.add(() => {
      count++
    })
    client.sendPointDown(10, 10, 1)
    client.sendPointMove(20, 20, 1)
    client.sendPointUp(20, 20, 1)
    context.step()
    expect(count).toBe(1)
    expect(inst.lastEvent).toEqual({
      x: -310,
      y: -260
    })
  })

  it('ignore multi touch - start', () => {
    let count = 0
    tooltipManager.onStart.add(() => {
      count++
    })
    client.sendPointDown(10, 10, 1)
    client.sendPointDown(15, 15, 2)
    context.step()
    expect(count).toBe(1)
  })

  it('ignore multi touch - move', () => {
    client.sendPointDown(10, 10, 1)
    client.sendPointDown(15, 15, 2)
    client.sendPointMove(25, 25, 2)
    context.step()
    expect(inst.subject).toMatchObject({
      x: 0,
      y: 0
    })
  })

  it('ignore multi touch - up', () => {
    let count = 0
    tooltipManager.onEnd.add(() => {
      count++
    })
    client.sendPointDown(10, 10, 1)
    client.sendPointDown(15, 15, 2)
    client.sendPointUp(15, 15, 2)
    context.step()
    expect(count).toBe(0)
  })

  it('create', () => {
    expect(inst.subject).toBeDefined()
    expect(inst.source).toBeDefined()
  })

  it('disable', () => {
    inst.disable()
    expect(inst.subject.touchable).toBe(false)
  })

  it('enable', () => {
    inst.enable()
    expect(inst.subject.touchable).toBe(true)
  })
})
