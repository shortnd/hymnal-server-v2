import { Channel } from './channel.entity'

describe('Channel class', () => {
  it('should make a new channel with no fields', () => {
    const channel = new Channel()
    expect(channel).toBeTruthy()
    expect(channel.name).toBe('')
  })
  it('should make a channel with a name', () => {
    const channel = new Channel('Channel 1')
    expect(channel).toBeTruthy()
    expect(channel.name).toBe('Channel 1')
  })
})