import { GameClient, GameContext } from '@akashic/headless-akashic'

declare global {
  // eslint-disable-next-line no-var,no-unused-vars
  var context: GameContext<3>
  // eslint-disable-next-line no-var,no-unused-vars
  var client: GameClient<3>
  /**
   * 引数に Scene の指定があれば、その Scene を load します。
   * なければ、 load 済み Scene を返します
   */
  // eslint-disable-next-line no-var,no-unused-vars
  var load: (scene?: g.Scene) => Promise<g.Scene>
  // eslint-disable-next-line no-var,no-unused-vars
  var unload: () => void
  // eslint-disable-next-line no-var,no-unused-vars
  var scene: g.Scene
}
