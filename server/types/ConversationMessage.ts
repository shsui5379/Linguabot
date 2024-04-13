export interface ConversationMessage {
    role: "system" | "assistant" | "user",
    content: string
};