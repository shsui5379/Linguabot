GET /api/chat/
    Expects:
        An optional "language" query parameter
    Returns:
        An array of all conversation instances for a user (without the messages) that satisfies the language filter, if specified

POST /api/chat/
    Expects:
        A nickname and language
    Description:
        Creates a conversation with the provided arguments
    Returns:
        Information about the conversation that was created

PATCH /api/chat/
    Expects:
        A chatId and nickname
    Description:
        Modifies the nickname of a specific conversation

DELETE /api/chat/
    Expects:
        A chatId
    Description:
        Deletes a specific conversation

POST /api/chat/completions/
    Expects:
        A ConversationMessage[] array consisting of every message in a conversation
    Returns:
        A ConversationMessage object representing the chatbot response

GET /api/chat/:conversationId/messages/
    Expects:
        An optional "starred" query parameter
    Returns:
        An array of messages comprising a conversation specified by conversationId that also satisfies the "starred" filter, if specified

POST /api/chat/message/
    Expects:
        A chatId, content, and role
    Description:
        Creates a message with the provided arguments
    Returns:
        Information about the message that was created

PATCH /api/chat/message/
    Expects:
        Arguments for messageId, note, starred, and content
    Description:
        Modifies a specific message

DELETE /api/chat/message/
    Expects:
        A messageId
    Description:
        Deletes a specific message