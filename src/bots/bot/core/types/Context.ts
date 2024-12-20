import { User } from '@prisma/client';
import { Context as ContextTelegraf, Scenes } from 'telegraf';
import { SceneSessionData } from 'telegraf/typings/scenes';

export interface SessionContext extends ContextTelegraf {
  session: {
    user: User;
    current_ticket_id: string;
  };
}

interface SessionState extends SceneSessionData {}

export type SessionSceneContext = SessionContext &
  Scenes.SceneContext<SessionState>;
