import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    const channel = await this.channelRepository.create(createChannelDto)
    this.channelRepository.save(channel)
    return channel
  }

  findAll() {
    return this.channelRepository.find()
  }

  async findOne(id: number) {
    const channel = await this.channelRepository.findOne(id)
    if (!channel) {
      throw new NotFoundException(`Channel with id ${id} was not found`)
    }
    return channel
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    const channel = await this.channelRepository.preload({
      id,
      ...updateChannelDto
    })
    if (!channel) {
      throw new NotFoundException(`Channel with id ${id} was not found to update.`)
    }
    return channel
  }

  async remove(id: number) {
    const channel = await this.findOne(id)
    return this.channelRepository.remove(channel)
  }
}
