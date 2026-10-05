import type { Pool } from 'pg';

import type { MessageRepository } from './message.repository.js';
import type { Message } from './message.types.js';

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at,
  };
}

export class PostgresMessageRepository implements MessageRepository {
  constructor(private readonly database: Pool) {}

  async create(message: Message): Promise<Message> {
    const result = await this.database.query<MessageRow>(
      `
        INSERT INTO messages (
          id,
          conversation_id,
          sender_id,
          content,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          conversation_id,
          sender_id,
          content,
          created_at
      `,
      [
        message.id,
        message.conversationId,
        message.senderId,
        message.content,
        message.createdAt,
      ],
    );

    return toMessage(result.rows[0]);
  }

  async findById(id: string): Promise<Message | null> {
    const result = await this.database.query<MessageRow>(
      `
        SELECT
          id,
          conversation_id,
          sender_id,
          content,
          created_at
        FROM messages
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? toMessage(result.rows[0]) : null;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const result = await this.database.query<MessageRow>(
      `
        SELECT
          id,
          conversation_id,
          sender_id,
          content,
          created_at
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
      `,
      [conversationId],
    );

    return result.rows.map(toMessage);
  }

  async findLastMessageByConversationId(
    conversationId: string,
  ): Promise<Message | null> {
    const result = await this.database.query<MessageRow>(
      `
        SELECT
          id,
          conversation_id,
          sender_id,
          content,
          created_at
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [conversationId],
    );

    return result.rows[0] ? toMessage(result.rows[0]) : null;
  }
}
