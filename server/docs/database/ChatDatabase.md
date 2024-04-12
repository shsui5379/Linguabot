# /server/database/ChatDatabase.md

## Synopses
Sequelize model for database operations for chat history

# Model
Each Chat shall have:
- an id to represent the Chat: primary key connecting to Message
- the id of the User it belongs to: foreign key connecting from User
- language that the Chat is in

# Exported functions
- async createChat(userId: string, chatId, language: Language): Chat
  - creates a new Chat based on the given details
- async fetchChats(userId: string, language?: Language): Chat[]
  - fetch Chat objects for the current user
  - optional paramter to filter by language
- async fetchChat(chatId: string): Chat
  - fetch a Chat by specified id