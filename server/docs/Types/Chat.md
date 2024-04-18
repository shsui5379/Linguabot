# /server/types/Chat.ts

## Synopses
Class representing an instance of a Chat

## Properties
- databaseRecord: ChatDatabase sequelize construct
  - privately stored reference to the database record
- chatId: string
  - pulled from record
- userId: string
  - pulled from record
- language: string
  - pulled from record
- nickname: string
  - public setters/getters
  - pulled from record

## Methods
- constructor(record)
- async delete()
  - deletes all messages and the chat itself