const g = require('@akashic/akashic-engine')
const { GameContext } = require('@akashic/headless-akashic')
const NodeEnvironment = require('jest-environment-node').default

class AkashicEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup()

    const context = new GameContext({})
    const client = await context.getGameClient()
    const game = client.game

    this.global.g = client.g
    this.global.g.game = game
    context.step() // これをいれないと g.game.pushSceneを受け付けない
    this.global.context = context
    this.global.client = client
    this.global.load = async (scene) => {
      if (scene == null) {
        scene = new g.Scene({ game, name: 'test' })
        game.pushScene(scene)
      }
      await client.advanceUntil(() => game.scene().name === scene.name)
      return scene
    }
    this.global.unload = () => {
      game.popScene()
      context.step() // これをしないと現在の scene が次のテストでも使われてしまう
    }
  }

  async teardown () {
    await this.global.context.destroy()
    delete this.global.context
    delete this.global.client
    delete this.global.g.game
    delete this.global.g
    await super.teardown()
  }
}

module.exports = AkashicEnvironment
