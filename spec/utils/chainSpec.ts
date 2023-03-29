import { Chain } from '../../src/utils/chain'

describe('chain', () => {
  it('何もないchainは開始してもトリガに入らない', () => {
    const target = new g.E({ scene })
    const inst = new Chain({ queue: [] })
    inst.start(target)
    expect(target.onUpdate).toHaveLength(0)
    expect(inst.started).toBe(true)
  })
  it('開始時に終了したchainはトリガに入らない', () => {
    const target = new g.E({ scene })
    const inst = new Chain({ queue: [() => true] })
    inst.start(target)
    expect(target.onUpdate).toHaveLength(0)
  })
  it('target指定時はそのonUpdateを使う', () => {
    const target = new g.E({ scene })
    const inst = new Chain({ queue: [() => false] })
    inst.start(target)
    expect(target.onUpdate).toHaveLength(1)
  })
  it('target未指定時はカレントsceneを使う', () => {
    const inst = new Chain({ queue: [() => false] })
    inst.start()
    expect(scene.onUpdate).toHaveLength(1)
  })
  it('終了したchainはトリガから外れる', () => {
    let cnt = 0
    const target = new g.E({ scene })
    const inst = new Chain({ queue: [() => ++cnt > 1] })
    inst.start(target)
    expect(target.onUpdate).toHaveLength(1)
    context.step()
    expect(target.onUpdate).toHaveLength(0)
  })
  it('1ステップで複数fn実行', () => {
    const target = new g.E({ scene })
    const inst = new Chain({
      queue: [() => true, () => true]
    })
    inst.start(target)
    expect(target.onUpdate).toHaveLength(0)
  })
  it('interruptすると終了する', () => {
    let cnt = 0
    const inst = new Chain({
      queue: [() => false],
      interrupted: () => cnt++
    })
    inst.start()
    context.step()
    expect(inst.ended).toBe(false)
    inst.interrupt()
    context.step()
    expect(inst.ended).toBe(true)
    expect(cnt).toBe(1)
  })
  it('終了済みの場合、interruptedが呼ばれない', () => {
    let count = 0
    const inst = new Chain({
      queue: [],
      interrupted: () => count++
    })
    context.step()
    expect(inst.ended).toBe(true)
    inst.interrupt()
    expect(count).toBe(0)
  })
})
