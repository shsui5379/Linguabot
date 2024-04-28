import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faVolumeHigh, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

export default function Message({ message, selectedLanguage }) {
    const [isStarred, setIsStarred] = useState(message.starred);

    // Performing text-to-speech
    function speak(message: string) {
        const locales = {
            Spanish: "es-ES",
            Korean: "ko-KR",
            Japanese: "ja-JA",
            English: "en-US",
            Chinese: "zn-CN",
            French: "fr-FR"
        };

        // Alert if speech synthesis is not supported by browser
        if (!("speechSynthesis" in window)) {
            alert("Sorry, your browser doesn't support text to speech!");
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

    let isUserMessage = message.role === "user";
    return (
        <>
            <div className={isUserMessage ? "user-text-wrapper" : "bot-text-wrapper"}>
                <p className={isUserMessage ? "user-text" : "bot-text"}>{message.content}</p>
                <div className={isUserMessage ? "message-tools-user-wrapper" : "message-tools-bot-wraper"}>
                    <div id="message-tools-bot">
                        <button className="message-tools-button" id="message-fav" onClick={handleStarClick}>{<FontAwesomeIcon icon={isStarred ? faStarReg : faStarSolid} />}</button>
                        <button className="message-tools-button" id="message-listen" onClick={() => speak(message.content)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                        <button className="message-tools-button" id="message-translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
                    </div>
                </div>
            </div>
        </>
    );
}