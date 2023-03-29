import { Chain, ChainComponent } from './chain'

export class ChainBuilder {
  private readonly queue: ChainComponent[]
  private _interrupted?: () => unknown

  constructor () {
    this.queue = []
  }

  then (cb: () => unknown) {
    this.queue.push(() => {
      cb()
      return true
    })
    return this
  }

  until (cb: ChainComponent) {
    this.queue.push(cb)
    return this
  }

  sleep (timeout: number) {
    let count = timeout * g.game.fps / 1000
    this.queue.push(() => {
      count--
      return count <= 0
    })
    return this
  }

  wait (trigger: g.Trigger) {
    let expired = false
    trigger.add(() => {
      expired = true
    })
    this.queue.push(() => expired)
    return this
  }

  interrupted (cb: () => unknown) {
    this._interrupted = cb
    return this
  }

  build () {
    return new Chain({
      queue: this.queue,
      interrupted: this._interrupted
    })
  }
}
