import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { WebsocketAuthGuard } from './guards/websocket-auth.guard';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    RealtimeGateway,
    RealtimeService,
    WebsocketAuthGuard,
  ],
  exports: [
    RealtimeService,
  ],
})
export class RealtimeModule {}