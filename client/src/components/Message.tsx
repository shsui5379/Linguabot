import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faVolumeHigh, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useRef, useState } from "react";
import "../css/ChatRoom.css";

export default function Message({ message, selectedLanguage, userLanguage }) {
    const [isStarred, setIsStarred] = useState(message.starred);
    const [useTranslated, setUseTranslated] = useState(false);
    const translatedText = useRef(null);

    // Performing text-to-speech
    function speak(message: string) {
        const locales = {
            Spanish: "es-ES",
            Korean: "ko-KR",
            Japanese: "ja-JA",
            English: "en-US",
            Mandarin: "zh-CN",
            French: "fr-FR"
        };

        // Alert if speech synthesis is not supported by browser
        if (!("speechSynthesis" in window)) {
            alert("Sorry, your browser doesn't support text to speech!");
            return;
        }

        let voiceMessage = new SpeechSynthesisUtterance(message);
        voiceMessage.lang = locales[selectedLanguage as keyof typeof locales];
        voiceMessage.rate = 0.9;
        window.speechSynthesis.speak(voiceMessage);
    }

    async function handleStarClick() {
        setIsStarred(!isStarred);
        await message.setStarred(!isStarred);
    }

    async function handleTranslate() {
        if (translatedText.current !== null) {
            setUseTranslated(!useTranslated);
        }
        else {
            translatedText.current = await translate(message.content);
            setUseTranslated(!useTranslated);
        }
    }

    // Perform translation
    async function translate(message: string) {
        const locales = {
            Spanish: "es",
            Korean: "ko",
            Japanese: "ja",
            English: "en",
            Mandarin: "zh",
            French: "fr"
        };
        const response = await fetch("https://translate.terraprint.co/translate", {
            method: "POST",
            body: JSON.stringify({
                q: message,
                source: locales[selectedLanguage as keyof typeof locales],
                target: locales[userLanguage as keyof typeof locales],
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        handleTranslate();
        console.log(data.translatedText);
        return data.translatedText;
    }

    let isUserMessage = message.role === "user";
    return (
        <>
            <div className={isUserMessage ? "user-text-wrapper" : "bot-text-wrapper"}>
                <p className={isUserMessage ? "user-text" : "bot-text"} id={message.content}>{useTranslated ? translatedText.current : message.content}</p>
                <div className={isUserMessage ? "message-tools-user-wrapper" : "message-tools-bot-wrapper"}>
                    <div id="message-tools-bot">
                        <button title="Save message" className="message-tools-button" onClick={handleStarClick}>{<FontAwesomeIcon icon={isStarred ? faStarReg : faStarSolid} />}</button>
                        <button title="Hear message" className="message-tools-button" onClick={() => speak(message.content)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                        <button title="Translate message" className="message-tools-button" onClick={() => translate(message.content)}>{<FontAwesomeIcon icon={faLanguage} />}</button>
                    </div>
                </div>
            </div>
        </>
    );
}