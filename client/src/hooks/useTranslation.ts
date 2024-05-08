import { useRef, useState } from "react";
import messagetools from "../utilities/messagetools";

export default function useTranslation(message: string, selectedLanguage: string, userLanguage: string) {
    const [showTranslation, setShowTranslation] = useState(false);
    const translatedText = useRef(null);

    async function toggle() {
        if (translatedText.current === null) {
            translatedText.current = await messagetools.translate(message, selectedLanguage, userLanguage);
        }
        setShowTranslation(!showTranslation);
    }

    return [showTranslation, translatedText.current, toggle];
}