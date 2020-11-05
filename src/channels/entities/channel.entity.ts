import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  constructor(name?: string) {
    this.name = name || ''
  }
}
