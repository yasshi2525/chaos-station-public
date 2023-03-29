export type ChainComponent = () => boolean
type ChainOption = {
  queue: ChainComponent[]
  interrupted?: () => unknown
}

export class Chain {
  private readonly queue: ChainComponent[]
  private readonly interrupted?: () => unknown
  private _started: boolean

  constructor (opts: ChainOption) {
    this.queue = opts.queue
    this.interrupted = opts.interrupted
    this._started = false
  }

  start (target?: { onUpdate: g.Trigger }) {
    this._started = true
    if (this.step()) {
      return
    }
    if (target) {
      target.onUpdate.add(() => this.step())
    } else {
      g.game.scene()!.onUpdate.add(() => this.step())
    }
  }

  interrupt () {
    if (this.ended) {
      return
    }
    if (this.interrupted) {
      this.interrupted()
    }
    this.queue.length = 0
  }

  step () {
    if (this.ended) {
      return true
    }
    while (!this.ended && this.queue[0]()) {
      this.queue.splice(0, 1)
    }
    return this.ended
  }

  get started () {
    return this._started
  }

  get ended () {
    return this.queue.length === 0
  }
}
