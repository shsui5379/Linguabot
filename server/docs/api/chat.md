GET /api/chat/
    Returns:
        An array of all conversation instances for a user (without the messages)

POST /api/chat/
    Expects:
        A nickname and language
    Description:
        Creates a conversation with the provided arguments

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

POST /api/chat/send/
    Expects:
        A ConversationMessage[] array consisting of every message in a conversation
    Returns:
        A ConversationMessage object representing the chatbot response

GET /api/chat/:conversationId/messages/
    Returns:
        An array of messages comprising a conversation specified by conversationId

POST /api/chat/message/
    Expects:
        A chatId, content, and role
    Description:
        Creates a message with the provided arguments

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