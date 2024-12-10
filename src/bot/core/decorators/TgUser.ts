import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { SessionSceneContext } from '../types/Context';
import { User } from 'telegraf/typings/core/types/typegram';

export const TgUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const telegrafCtx = TelegrafExecutionContext.create(ctx);
    const context = telegrafCtx.getContext<SessionSceneContext>();
    return context.from;
  },
);
