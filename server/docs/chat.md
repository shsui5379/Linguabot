Miscellaneous API Endpoints

/api/chat/send POST
    Expects:
        A ChatMessage[] array representing every ChatMessage object comprising a conversation
    Returns:
        A ChatMessage object representing the appropriate response

/api/chat/preferences GET
    Returns:
        An object of the format
        {
            userLanguage: string
            targetLanguages: string[]
        }