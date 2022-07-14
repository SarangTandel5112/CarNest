import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserJwtInterceptor implements NestInterceptor {
    constructor(
        private usersService: UsersService,
        private jwtservice: JwtService
    ) { }
    async intercept(context: ExecutionContext, handler: CallHandler): Promise<Observable<any>> {

        const request = context.switchToHttp().getRequest();
        // console.log(request);
        const hashToken = request.cookies.AuthToken;
        const token = await this.jwtservice.verify(hashToken);
        console.log(token.id);
        if (token.id) {
            const user = await this.usersService.findOne(token.id)
            request.currentUser = user;
        }
        return handler.handle();
    }
}