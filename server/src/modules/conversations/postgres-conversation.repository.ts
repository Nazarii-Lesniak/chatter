import type { Pool } from 'pg';

import type { ConversationRepository } from './conversation.repository.js';
import type {
  Conversation,
  ConversationParticipant,
} from './conversation.types.js';

interface ConversationRow {
  id: string;
  created_at: string;
  updated_at: string;
}

interface ParticipantRow {
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

function toConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toParticipant(row: ParticipantRow): ConversationParticipant {
  return {
    conversationId: row.conversation_id,
    userId: row.user_id,
    joinedAt: row.joined_at,
  };
}

export class PostgresConversationRepository implements ConversationRepository {
  constructor(private readonly database: Pool) {}

  async create(conversation: Conversation): Promise<Conversation> {
    const result = await this.database.query<ConversationRow>(
      `
        INSERT INTO conversations (
          id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3)
        RETURNING id, created_at, updated_at
      `,
      [conversation.id, conversation.createdAt, conversation.updatedAt],
    );

    return toConversation(result.rows[0]);
  }

  async findById(id: string): Promise<Conversation | null> {
    const result = await this.database.query<ConversationRow>(
      `
        SELECT id, created_at, updated_at
        FROM conversations
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? toConversation(result.rows[0]) : null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const result = await this.database.query<ConversationRow>(
      `
        SELECT c.id, c.created_at, c.updated_at
        FROM conversations c
        INNER JOIN conversation_participants cp
          ON cp.conversation_id = c.id
        WHERE cp.user_id = $1
        ORDER BY c.updated_at DESC
      `,
      [userId],
    );

    return result.rows.map(toConversation);
  }

  async findPrivateConversation(
    firstUserId: string,
    secondUserId: string,
  ): Promise<Conversation | null> {
    const result = await this.database.query<ConversationRow>(
      `
        SELECT c.id, c.created_at, c.updated_at
        FROM conversations c
        INNER JOIN conversation_participants cp
          ON cp.conversation_id = c.id
        WHERE cp.user_id IN ($1, $2)
        GROUP BY c.id
        HAVING COUNT(DISTINCT cp.user_id) = 2
           AND COUNT(*) = 2
        LIMIT 1
      `,
      [firstUserId, secondUserId],
    );

    return result.rows[0] ? toConversation(result.rows[0]) : null;
  }

  async addParticipant(
    participant: ConversationParticipant,
  ): Promise<ConversationParticipant> {
    const result = await this.database.query<ParticipantRow>(
      `
          INSERT INTO conversation_participants (
            conversation_id,
            user_id,
            joined_at
          )
          VALUES ($1, $2, $3)
          RETURNING conversation_id, user_id, joined_at
        `,
      [participant.conversationId, participant.userId, participant.joinedAt],
    );

    return toParticipant(result.rows[0]);
  }

  async findParticipants(
    conversationId: string,
  ): Promise<ConversationParticipant[]> {
    const result = await this.database.query<ParticipantRow>(
      `
          SELECT conversation_id, user_id, joined_at
          FROM conversation_participants
          WHERE conversation_id = $1
          ORDER BY joined_at
        `,
      [conversationId],
    );

    return result.rows.map(toParticipant);
  }

  async isParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.database.query(
      `
        SELECT 1
        FROM conversation_participants
        WHERE conversation_id = $1
          AND user_id = $2
        LIMIT 1
      `,
      [conversationId, userId],
    );

    return result.rowCount !== 0;
  }
}
