import { ChainBuilder } from '../../src/utils/chain_builder'

describe('chainBuilder', () => {
  it('then', () => {
    let cnt = 0
    const chain = new ChainBuilder().then(() => cnt++).build()
    chain.start()
    expect(cnt).toBe(1)
  })
  it('until', () => {
    let cnt = 0
    const chain = new ChainBuilder().until(() => ++cnt > 1).build()
    chain.start()
    context.step()
    context.step()
    expect(cnt).toBe(2)
  })
  it('sleep', () => {
    const chain = new ChainBuilder().sleep(1000).build()
    chain.start()
    for (let i = 0; i < g.game.fps; i++) {
      context.step()
    }
    expect(chain.ended).toBe(true)
  })
  it('wait', () => {
    let cnt = 0
    const e = new g.E({ scene })
    e.onUpdate.add(() => cnt++ > 1)
    const chain = new ChainBuilder().wait(e.onUpdate).build()
    chain.start()
    context.step()
    context.step()
    expect(cnt).toBe(2)
    expect(chain.ended).toBe(true)
  })
  it('interrupted', () => {
    let cnt = 0
    const chain = new ChainBuilder()
      .until(() => false).interrupted(() => cnt++).build()
    chain.start()
    chain.interrupt()
    expect(cnt).toBe(1)
  })
})
