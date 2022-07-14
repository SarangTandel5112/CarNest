import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        console.log("Inside Current User Decorator");

        const request = context.switchToHttp().getRequest();
        // console.log(request.session.userId);
        return request.currentUser;
    })