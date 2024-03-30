# /client/src/types/User.ts

## Synopsis
Client-side object to represent a User. Communicates with /api/user endpoint.

## Properties
- #userId: string
- #firstName: string
  - length: 1-255
- #lastName: string
  - length: 1-255
- #userLanguage: Language
- #targetLanguage: Language[]
  - length: 1+

## Methods
- private constructor(userId: string, firstName: string, lastName: string, userLanguage: Language, targetLanguage: Language[])
- static async fetchUser(): User | null
  - calls GET /api/user
  - use response body to construct and return an User instance
- static async createUser(firstName: string, lastName: string, userLanguage: Language, targetLanguage: Language[]): User
  - calls POST /api/user
  - use response body to construct and return an User instance
- get methods for all properties
- set methods for all properties except for userId
  - calls PATCH /api/user
- async delete(): void
  - calls DELETE /api/user
- getChatConfig(): JSON
  - post-MVP
- getNotes(): Note[]
  - post-MVP
- getChatHistory(): ChatHistory[]
  - post-MVP