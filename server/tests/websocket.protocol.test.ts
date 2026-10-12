import { describe, expect, it } from 'vitest';

import { parseClientEvent } from '../src/infrastructure/websocket/websocket.protocol';

const json = (value: unknown) => JSON.stringify(value);

describe('parseClientEvent', () => {
  describe('valid events', () => {
    it('parses system:ping', () => {
      expect(parseClientEvent(json({ type: 'system:ping' }))).toEqual({
        type: 'system:ping',
      });
    });

    it('parses conversation:join', () => {
      const event = {
        type: 'conversation:join',
        payload: { conversationId: 'c1' },
      };

      expect(parseClientEvent(json(event))).toEqual(event);
    });

    it('parses conversation:leave', () => {
      const event = {
        type: 'conversation:leave',
        payload: { conversationId: 'c1' },
      };

      expect(parseClientEvent(json(event))).toEqual(event);
    });

    it('parses message:send', () => {
      const event = {
        type: 'message:send',
        payload: { conversationId: 'c1', content: 'Hello!' },
      };

      expect(parseClientEvent(json(event))).toEqual(event);
    });

    it('drops unknown fields from the payload', () => {
      const parsed = parseClientEvent(
        json({
          type: 'message:send',
          payload: { conversationId: 'c1', content: 'Hi', senderId: 'spoofed' },
        }),
      );

      expect(parsed).toEqual({
        type: 'message:send',
        payload: { conversationId: 'c1', content: 'Hi' },
      });
    });
  });

  describe('invalid input', () => {
    it.each([
      ['malformed JSON', '{not json'],
      ['an empty string', ''],
      ['a JSON string', json('hello')],
      ['a JSON number', json(42)],
      ['null', json(null)],
      ['an object without a type', json({ payload: {} })],
      ['an unknown event type', json({ type: 'admin:delete-everything' })],
    ])('returns null for %s', (_name, raw) => {
      expect(parseClientEvent(raw)).toBeNull();
    });

    it.each([
      ['conversation:join', { conversationId: 123 }],
      ['conversation:join', {}],
      ['conversation:leave', { conversationId: null }],
      ['message:send', { conversationId: 'c1' }],
      ['message:send', { conversationId: 'c1', content: 42 }],
      ['message:send', { conversationId: 7, content: 'Hi' }],
    ])('returns null for %s with payload %j', (type, payload) => {
      expect(parseClientEvent(json({ type, payload }))).toBeNull();
    });

    it.each([
      'conversation:join',
      'conversation:leave',
      'message:send',
    ])('returns null for %s without a payload', (type) => {
      expect(parseClientEvent(json({ type }))).toBeNull();
    });
  });
});
