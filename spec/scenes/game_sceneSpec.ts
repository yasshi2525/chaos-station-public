import { GameScene } from '../../src/scenes/game_scene'

describe('game_scene', () => {
  it.each([false, true])('load', async (debug) => {
    const inst = new GameScene({
      game: g.game,
      debug
    })
    g.game.pushScene(inst)
    await client.advanceUntil(() => g.game.scene()!.name === 'game')
    expect(g.game.scene()?.name).toBe('game')
  })
})
