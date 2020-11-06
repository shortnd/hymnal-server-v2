import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { ChannelsModule } from '../src/channels/channels.module'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Channel } from '../src/channels/entities/channel.entity'


describe('Channels', () => {
  let app: INestApplication
  let repo: Repository<Channel>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ChannelsModule, TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        autoLoadEntities: true
      })],
    }).compile()

    app = moduleRef.createNestApplication()
    repo = moduleRef.get('ChannelRepository')
    await app.init()
  })

  it('/GET channels', async () => {
    await repo.save([
      { name: 'Channel 1' },
      { name: 'Channel 2' }
    ])
    const { body } = await request(app.getHttpServer()).get('/channels').expect(200)
    expect(body).toEqual([
      { id: expect.any(Number), name: 'Channel 1' },
      { id: expect.any(Number), name: 'Channel 2' }
    ])
  })

  it('GET channels/1', async () => {
    const { body } = await request(app.getHttpServer()).get(`/channels/1`).expect(200)
    expect(body).toEqual({ id: expect.any(Number), name: 'Channel 1' })
  })

  it('POST channels', async () => {
    const { body } = await request(app.getHttpServer()).post('/channels').send({
      name: 'Channel 3'
    }).expect(201)
    expect(body).toEqual({ name: 'Channel 3' })
  })

  it('PUT channels', async () => {
    const { body } = await request(app.getHttpServer()).put(`/channels/3`).send({
      name: 'Channel 3!'
    }).expect(200)
    expect(body).toEqual({ id: 3, name: 'Channel 3!' })
  })

  it('DELETE channels', async () => {
    const { body } = await request(app.getHttpServer()).delete(`/channels/3`).expect(200)
    expect(body).toEqual({ name: 'Channel 3' })
  })

  afterAll(async () => {
    await repo.query(`DROP TABLE channels;`)
    await app.close()
  })
})