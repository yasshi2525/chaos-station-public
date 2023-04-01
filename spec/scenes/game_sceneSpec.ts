import { GameScene } from '../../src/scenes/game_scene'

describe('game_scene', () => {
  it.each([[false, false], [true, false], [true, true]])('load', async (rotate, grid) => {
    const inst = new GameScene({
      game: g.game,
      debug: {
        rotate,
        grid
      }
    })
    g.game.pushScene(inst)
    await client.advanceUntil(() => g.game.scene()!.name === 'game')
    expect(g.game.scene()?.name).toBe('game')
    await context.advance(10000)
  })
})
