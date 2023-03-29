import _bootstrap from '../src/_bootstrap'

describe('_bootstrap', () => {
  it('custom parameters', async () => {
    _bootstrap({ args: { foo: 'bar' } })
    await client.advanceUntil(() => g.game.scene()?.name === 'game')
    const params = g.game.vars.originalParameter
    expect(params.args).toHaveProperty('foo', 'bar')
  })

  it('no session parameters', async () => {
    _bootstrap({})
    await client.advanceUntil(() => g.game.scene()?.name === 'game')
    expect(g.game.scene()?.name).toBe('game')
    const params = g.game.vars.originalParameter
    expect(params.sessionParameter).toEqual({})
    expect(params.isAtsumaru).toBe(false)
    expect(g.game.random).toBe(params.random)
  })
  it('with session parameters', () => {
    const original = g.game.random
    _bootstrap({})
    context.step()
    g.game.raiseEvent(new g.MessageEvent({
      type: 'start',
      parameters: { randomSeed: 2 }
    }))
    context.step()
    context.step()
    expect(g.game.random).not.toBe(original)
    expect(g.game.random.seed).toBe(2)
  })

  it('with session parameters unless random seed', () => {
    const original = g.game.random
    _bootstrap({})
    context.step()
    g.game.raiseEvent(new g.MessageEvent({
      type: 'start',
      parameters: {}
    }))
    context.step()
    context.step()
    expect(g.game.random).toBe(original)
  })

  it('atsumaru', async () => {
    // @ts-ignore
    // noinspection JSConstantReassignment
    global.window = { RPGAtsumaru: true }
    _bootstrap({})
    await client.advanceUntil(() => g.game.scene()?.name === 'game')
    const params = g.game.vars.originalParameter
    expect(params.isAtsumaru).toBe(true)
  })

  it('no atsumaru', async () => {
    // @ts-ignore
    // noinspection JSConstantReassignment
    global.window = {}
    _bootstrap({})
    await client.advanceUntil(() => g.game.scene()?.name === 'game')
    const params = g.game.vars.originalParameter
    expect(params.isAtsumaru).toBe(false)
  })
})
