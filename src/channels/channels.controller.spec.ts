import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

describe('ChannelsController', () => {
  let controller: ChannelsController;
  let service: ChannelsService
  let mockUsersResults: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [{
        provide: ChannelsService,
        useValue: {
          findAll: jest.fn().mockReturnValue([
            { name: 'Channel 1' },
            { name: 'Channel 2' }
          ]),
          findOne: jest.fn().mockReturnValue({
            name: 'Channel 1',
            id: 1,
          })
        },
      }],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of channels', () => {
      expect(controller.findAll()).toEqual([
        {
          name: 'Channel 1'
        }, {
          name: 'Channel 2'
        }
      ])
    })
  })

  describe('find', () => {
    it('should return a single channel', () => {
      expect(controller.findOne('1')).toEqual({ name: 'Channel 1', id: 1 })
    })
  })
});
