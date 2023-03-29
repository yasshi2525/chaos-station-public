import { image } from '../../src/utils/assets'

describe('utils', () => {
  it('image', () => {
    expect(() => image('dummy')).toThrow()
  })
})
