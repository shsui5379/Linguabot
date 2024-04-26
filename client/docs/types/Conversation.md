# /client/src/types/Conversation.ts

## Synosis
Client-side class representing an instance of a conversation

## Properties
- #chatId: string
- #language: Language
- #nickname: string
- #messages: Message[]

## Methods
- private constructor(chatId: string, language: Language, nickname: string, messages: Message[])
- private async updateConversation()
- static async fetchConversations()
- static async createConversation(language: Language, nickname: string)
- async configure(configurationMessage: string)
- async send(message: string)
- async receive()
- async delete()
- async setNickname(nickname: string)
- getters