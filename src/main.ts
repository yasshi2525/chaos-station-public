import { GameMainParameterObject } from './parameterObject'
import { GameScene } from './scenes/game_scene'

export function main (param: GameMainParameterObject): void {
  g.game.random = param.random
  g.game.vars.originalParameter = param
  g.game.pushScene(new GameScene({
    game: g.game,
    debug: param.sessionParameter.debug ?? false
  }))
}
