# /client/src/types/Message.ts

## Synopsis
Client-side class representing an instance of a message

## Properties
- #messageId: string
- #language: Language
- #note: string
- #starred: boolean
- #content: string
- #role: "system" | "assistant" | "user"

## Methods
- private constructor(messageId: string, language: Language, note: string, starred: boolean, 
                      content: string, role: "system" | "assistant" | "user")
- private async updateMessage()
- static async fetchMessages(chatId: string)
- static async createMessage(chatId: string, content: string, role: "system" | "assistant" | "user")
- async delete()
- async setNote(note: string)
- async setStarred(starred: boolean)
- async setContent(content: string)
- getters