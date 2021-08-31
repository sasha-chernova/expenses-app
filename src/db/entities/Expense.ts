import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import {User} from './User';

@Entity({
  name: 'expenses',
})
export class Expense {
  @PrimaryGeneratedColumn({name: 'id'})
  id!: number;

  @Column({
    name: 'purpose',
    type: String,
    length: 32,
  })
  purpose!: string;

  @Column({
    name: 'amount',
    type: 'float4',
  })
  amount!: number;

  @Column({
    name: 'time',
    type: 'int8',
  })
  time!: number;

  @ManyToOne((type) => User, (user) => user.expenses)
  user!: User;
}
