# /server/types/User.ts

## Synopses
Class representing a user

## Members
- firstName: string
- lastName: string
- #databaseRecord: UserDatabase
- userLanguage: Language
- targetLanguages[]: Language
- userId: string

# Methods
- constructor to initialize all members
- getters/setters for above public members
  - setters will also save the updated value into databaseRecord
- fetchNotes(): Note[]
  - post-MVP stretch goal
- fetchConversationHistory(): Conversation[]
  - post-MVP stretch goal
- delete(): void
  - deletes the user
- toJSON(): Object
  - a JSON fit for transmission