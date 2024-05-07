import { useEffect, useState } from "react";
import { Language } from "../types/Language";
import Conversation from "../types/Conversation";

export default function useFetchConversationData(language: Language | "", onlyStarredMessages: boolean) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    useEffect(() => {
        if (language === "") {
            return;
        }

        Conversation.fetchConversations(language, onlyStarredMessages)
            .then((conversations) => setConversations(conversations));
    }, [language, onlyStarredMessages]);
    return [conversations, setConversations];
}