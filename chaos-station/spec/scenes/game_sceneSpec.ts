import { GameScene } from '../../src/scenes/game_scene'

describe('game_scene', () => {
  it('load', async () => {
    const inst = new GameScene({ game: g.game })
    g.game.pushScene(inst)
    await client.advanceUntil(() => g.game.scene()!.name === 'game')
    expect(g.game.scene()?.name).toBe('game')
  })
})
