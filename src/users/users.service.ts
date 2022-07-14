import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(email: string, password: string) {
        const user = this.repo.create({ email, password })
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneById(id);
    }

    find(email: string) {
        return this.repo.find({ where: { email } })
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) {
            throw new Error('User Does not exist')
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.repo.findOneById(id);
        if (!user) {
            throw new Error('User Does not exist')
        }
        return this.repo.remove(user)
    }

}
