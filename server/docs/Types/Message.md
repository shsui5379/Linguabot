# /server/types/Message.ts

## Synopses
Class representing an instance of a Message

## Properties
- databaseRecord: MessageDatabase sequelize construct
  - privately stored reference to the database record
- chatId: string
  - pulled from record
- messageId: string
  - pulled from record
- language: string
  - will resolve from db relationships
- userId: string
  - will resolve from db relationships
- note: string
  - via public setters/getters
  - pulled from record
- starred: bool
  - via public setters/getters
  - pulled from record
- content: string
  - via public setters getters
  - pulled from record
- role: string
  - pulled from record
  - assistant | user | system
- timestamp: number
  - pulled from record
  - unix time

## Methods
- constructor(record)
- async delete()