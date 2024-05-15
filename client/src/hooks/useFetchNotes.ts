import { useState, useEffect} from "react";
import Message from "../types/Message";
import { Language } from "../types/Language";

export default function useFetchNotes(language: Language | "") {
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        if (language === "") {
            return;
        }
        
        Message.fetchMessages("", true, true, true, language)
            .then((result) => setMessages(result))
            .catch((error) => console.error(error.message));
    }, [language]);
    return [messages, setMessages];
}