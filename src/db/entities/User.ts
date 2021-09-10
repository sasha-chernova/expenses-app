import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Expense } from './Expense';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({name: 'id'})
  id!: number;

  @Column({
    name: 'first_name',
    type: String,
    length: 64,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: String,
    length: 16,
  })
  lastName!: string;

  @Column({
    name: 'age',
    type: 'int2',
  })
  age!: number;

  @Column({
    name: 'password',
    length: 255,
    type: String,
  })
  passwd!: string;

  @Column({
    name: 'role',
    length: 16,
    type: String,
    default: 'USER'
  })
  role!: string;

  @OneToMany((type) => Expense, (expense) => expense.user)
  expenses!: Expense[];
}
