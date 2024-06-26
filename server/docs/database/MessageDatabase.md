# /server/database/MessageDatabase.md

## Synopses
Sequelize model for database operations for messages

# Model
Each Message shall have:
- an id to represent the Message
- chat id as foreign key to Chat
- content
- note
- starred boolean
- role (system, assistant, user)
- timestamp as unix time stamp number

## Methods
- fetchMessage(messageId: string): Message
- fetchMessages(userId: string, chatId: string, language?: Language, mustHaveStar?: bool, mustHaveNote?: bool, sortLastModified?: bool): Message[]
- createMessage(messageId: string, chatId: string, content: string, role: "system" | "user" | "assistant"): Message
