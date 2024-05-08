# /client/src/types/Conversation.ts

## Synosis
Client-side class representing an instance of a conversation

## Properties
- #chatId: string
- #language: Language
- #nickname: string
- #messages: Message[]
- #timestamp: number

## Methods
- private constructor(chatId: string, language: Language, nickname: string, messages: Message[], timestamp: number)
- private async updateConversation()
- static async fetchConversations(language: Language | ".*" = ".*", onlyStarredMessages: boolean = false)
- static async createConversation(language: Language, nickname: string)
- async configure(configurationMessage: string)
- async send(message: string)
- async receive()
- async delete()
- async setNickname(nickname: string)
- getters