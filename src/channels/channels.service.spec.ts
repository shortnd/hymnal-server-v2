import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn()
})

const oneChannel = new Channel('Channel 1')
describe('ChannelsService', () => {
  let service: ChannelsService;
  let channelRepository: MockRepository 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService, {
        provide: Connection, useValue: {}
      }, {
        provide: getRepositoryToken(Channel),
        useValue: createMockRepository()
      }],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
    channelRepository = module.get<MockRepository>(getRepositoryToken(Channel))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('returns an array of channels', () => {
      channelRepository.find.mockReturnValue([oneChannel])
      expect(service.findAll()).toEqual([oneChannel])
    })
  })

  describe('findOne', () => {
    describe('when channel with ID exists', () => {
      it('should return the channel object', async () => {
        const channelID = '1'
        const expectedChannel = {}
        channelRepository.findOne.mockReturnValue(expectedChannel)
        const channel = await service.findOne(+channelID)
        expect(channel).toEqual(expectedChannel)
      })
    })
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const channelID = '1'
        channelRepository.findOne.mockReturnValue(undefined)

        try {
          await service.findOne(+channelID)
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException)
          expect(err.message).toEqual(`Channel with id ${channelID} was not found`)
        }
      })
    })
  })

  describe('create', () => {
    it('should successfully create a channel', () => {
      channelRepository.create.mockReturnValue(oneChannel)
      expect(service.create({
        name: 'Channel 1'
      })).resolves.toEqual(oneChannel)
      expect(channelRepository.create).toBeCalledTimes(1)
      expect(channelRepository.create).toBeCalledWith({
        name: 'Channel 1'
      })
    })
  })

  describe('update', () => {
    it('should call the update method', async () => {
      channelRepository.preload.mockReturnValue(oneChannel)
      const channel = await service.update(1, {
        name: 'Channel 1'
      })
      expect(channel).toEqual(oneChannel)
    })

    it('should throw not found exception when no channel is found', async () => {
      channelRepository.preload.mockReturnValue(undefined)
      try {
        await service.update(1, {
          name: 'channel 1'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException)
        expect(err.message).toEqual(`Channel with id 1 was not found to update`)
      }
    })
  })

  describe('delete', () => {
    it('should return deleted item', () => {
      channelRepository.remove.mockReturnValue(oneChannel)
      expect(service.remove(1)).resolves.toEqual(oneChannel)
      // expect(channelRepository.remove).toBeCalledWith(oneChannel)
    })
  })
});
