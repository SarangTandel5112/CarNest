import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class JwtAuthGuard implements CanActivate {

    canActivate(context: ExecutionContext) {
        console.log('inside guard');
        const request = context.switchToHttp().getRequest();
        return request.cookies.AuthToken;
    }
}