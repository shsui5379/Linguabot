import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faVolumeHigh, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useRef, useState } from "react";
import "../css/ChatRoom.css";
import messagetools from "../utilities/messagetools";

export default function Message({ message, selectedLanguage, userLanguage, mostRecent }) {
    const [isStarred, setIsStarred] = useState(message.starred);
    const [useTranslated, setUseTranslated] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const translatedText = useRef(null);

    // Performing text-to-speech
    function speak(message: string) {
        let speaker = messagetools.speak(message, selectedLanguage);

        if (!speaker) return;

        setIsSpeaking(true);

        speaker.onend = () => setIsSpeaking(false);
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
        let translation = await messagetools.translate(message, selectedLanguage, userLanguage)

        handleTranslate();

        return translation;
    }

    let isUserMessage = message.role === "user";
    if (mostRecent) {
        return <>
            <div className={isUserMessage ? "user-text-wrapper" : "bot-text-wrapper"}>
                <p className={isUserMessage ? "user-text" : "bot-text"} id={message.content}>{useTranslated ? translatedText.current : message.content}</p>
                <div className={isUserMessage ? "message-tools-user-wrapper" : "message-tools-bot-wrapper"}>
                    <div id="message-tools-bot">
                        <button title="Save message" className="message-tools-button" onClick={handleStarClick}>{<FontAwesomeIcon icon={isStarred ? faStarReg : faStarSolid} />}</button>
                        <button title="Hear message" className={`${isSpeaking ? "speaking-active" : ""} message-tools-button`} onClick={() => speak(message.content)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                    </div>
                </div>
            </div>
        </>
    }
    return (
        <>
            <div className={isUserMessage ? "user-text-wrapper" : "bot-text-wrapper"}>
                <p className={isUserMessage ? "user-text" : "bot-text"} id={message.content}>{useTranslated ? translatedText.current : message.content}</p>
                <div className={isUserMessage ? "message-tools-user-wrapper" : "message-tools-bot-wrapper"}>
                    <div id="message-tools-bot">
                        <button title="Save Message" className="message-tools-button" onClick={handleStarClick}>{<FontAwesomeIcon icon={isStarred ? faStarSolid : faStarReg} />}</button>
                        <button title="Hear Message" className={`${isSpeaking ? "speaking-active" : ""} message-tools-button message-tools-listen`} onClick={() => speak(message.content)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                        <button title="Translate Message" className={`${useTranslated ? "translation-active" : ""} message-tools-button message-tools-translate`} onClick={() => translate(message.content)}>{<FontAwesomeIcon icon={faLanguage} />}</button>
                    </div>
                </div>
            </div>
        </>
    );
}