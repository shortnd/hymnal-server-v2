import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

describe('ChannelsController', () => {
  let controller: ChannelsController;
  let service: ChannelsService

  const channelsArray = [
    new Channel('Channel 1'),
    new Channel('Channel 2')
  ]
  const oneChannel = new Channel('Channel 1')

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [{
        provide: ChannelsService,
        useValue: {
          findAll: jest.fn().mockReturnValue(channelsArray),
          findOne: jest.fn().mockReturnValue(oneChannel),
          create: jest.fn().mockReturnValue(oneChannel),
          update: jest.fn().mockReturnValue(oneChannel),
          remove: jest.fn().mockReturnValue(oneChannel)
        },
      }],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
    service = module.get<ChannelsService>(ChannelsService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of channels', () => {
      expect(controller.findAll()).toEqual(channelsArray)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('find', () => {
    it('should return a single channel', () => {
      expect(controller.findOne('1')).toEqual(oneChannel)
      expect(service.findOne).toBeCalledTimes(1)
    })
  })

  describe('create', () => {
    it('should return the new channel', () => {
      expect(controller.create({ name: 'Channel 1' })).toEqual(oneChannel)
      expect(service.create).toBeCalledTimes(1)
    })
  })

  describe('update', () => {
    it('should return the updated channel', () => {
      expect(controller.update('1', { name: 'Channel 1' })).toEqual(oneChannel)
      expect(service.update).toBeCalledTimes(1)
    })
  })

  describe('remove', () => {
    it('should return the removed channel', () => {
      expect(controller.remove('1')).toEqual(oneChannel)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
  })
});
