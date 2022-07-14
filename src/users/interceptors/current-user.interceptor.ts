import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private usersService: UsersService) { }

    async intercept(context: ExecutionContext, handler: CallHandler): Promise<Observable<any>> {
        console.log("Inside CurrentUserInterceptor");
        const request = context.switchToHttp().getRequest();
        // console.log(request);
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
        }
        return handler.handle();
    }
}