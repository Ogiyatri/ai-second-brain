import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AiService } from '../application/ai.service';

interface AuthSocket extends Socket {
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly aiService: AiService,
  ) {}

  handleConnection(client: AuthSocket) {
    try {
      const token = client.handshake.auth?.token as string;
      if (!token) throw new Error('No token');
      const payload = this.jwtService.verify<{ sub: string }>(token);
      client.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: AuthSocket) {}

  @SubscribeMessage('join_session')
  handleJoinSession(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { session_id: string },
  ) {
    void client.join(`session:${data.session_id}`);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody()
    data: { message: string; session_id?: string; document_ids?: string[] },
  ) {
    try {
      const result = await this.aiService.chat(
        client.userId,
        data.message,
        data.document_ids || [],
        data.session_id,
      );
      client.emit('message', result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Chat failed';
      client.emit('error', { message });
    }
  }
}
