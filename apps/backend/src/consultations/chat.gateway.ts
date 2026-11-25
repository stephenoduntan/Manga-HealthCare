import { Injectable, Logger } from '@nestjs/common';
import { Server as HttpServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

interface ChatClient {
  socket: WebSocket;
  roomId: string;
  userId: string;
  role: string;
}

/**
 * WebSocket gateway mounted at `/chat` (wss://api.mangahealthcare.com/chat)
 * Handles text consultation fallback, typing indicators, attachment alerts, and queue status updates.
 */
@Injectable()
export class ConsultationChatGateway {
  private readonly logger = new Logger(ConsultationChatGateway.name);
  private wss: WebSocketServer | null = null;
  private rooms = new Map<string, Set<ChatClient>>();

  attach(httpServer: HttpServer): void {
    if (this.wss) return;
    this.wss = new WebSocketServer({ server: httpServer, path: '/chat' });

    this.wss.on('connection', (socket, req) => {
      const url = new URL(req.url || '/chat', 'http://localhost');
      const roomId = url.searchParams.get('room') || 'lobby';
      const userId = url.searchParams.get('user_id') || 'anonymous';
      const role = url.searchParams.get('role') || 'PATIENT';

      const client: ChatClient = { socket, roomId, userId, role };
      this.joinRoom(roomId, client);

      socket.send(
        JSON.stringify({
          event: 'connected',
          room: roomId,
          timestamp: new Date().toISOString(),
        }),
      );

      socket.on('message', (raw) => {
        try {
          const parsed = JSON.parse(raw.toString()) as {
            event?: string;
            room?: string;
            payload?: unknown;
          };
          const targetRoom = parsed.room || client.roomId;
          if (parsed.event === 'join_room' && parsed.room) {
            this.leaveRoom(client);
            client.roomId = parsed.room;
            this.joinRoom(parsed.room, client);
            return;
          }

          this.broadcast(targetRoom, {
            event: parsed.event || 'chat_message',
            sender_id: client.userId,
            sender_role: client.role,
            room: targetRoom,
            payload: parsed.payload ?? null,
            timestamp: new Date().toISOString(),
          });
        } catch {
          socket.send(JSON.stringify({ event: 'error', message: 'Invalid JSON payload' }));
        }
      });

      socket.on('close', () => {
        this.leaveRoom(client);
      });
    });

    this.logger.log('WebSocket chat gateway attached at /chat');
  }

  broadcast(roomId: string, message: Record<string, unknown>): void {
    const clients = this.rooms.get(roomId);
    if (!clients) return;
    const serialized = JSON.stringify(message);
    for (const c of clients) {
      if (c.socket.readyState === WebSocket.OPEN) {
        c.socket.send(serialized);
      }
    }
  }

  private joinRoom(roomId: string, client: ChatClient): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(client);
  }

  private leaveRoom(client: ChatClient): void {
    const clients = this.rooms.get(client.roomId);
    if (!clients) return;
    clients.delete(client);
    if (clients.size === 0) {
      this.rooms.delete(client.roomId);
    }
  }
}
