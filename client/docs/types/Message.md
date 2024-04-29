# /client/src/types/Message.ts

## Synopsis
Client-side class representing an instance of a message

## Properties
- #messageId: string
- #note: string
- #starred: boolean
- #content: string
- #role: "system" | "assistant" | "user"
- #timestamp: number

## Methods
- private constructor(messageId: string, note: string, starred: boolean, content: string, 
                      role: "system" | "assistant" | "user", timestamp: number)
- private async updateMessage()
- static async fetchMessages(chatId: string)
- static async createMessage(chatId: string, content: string, role: "system" | "assistant" | "user")
- async delete()
- async setNote(note: string)
- async setStarred(starred: boolean)
- async setContent(content: string)
- getters