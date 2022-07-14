import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        const hashpassword = await bcrypt.hash(password, 10);

        const users = await this.usersService.find(email);
        if (users.length) {
            // throw new BadRequestException('Email in use');
        }
        const user = await this.usersService.create(email, hashpassword)

        return user;

    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('User Not Found')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BadRequestException('Incorrect Password')
        }
        return user;
    }

}