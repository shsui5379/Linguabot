import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faVolumeHigh, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import "../css/ChatRoom.css";

export default function Message({ message, selectedLanguage }) {
    const [isStarred, setIsStarred] = useState(false);
    const [translatedStatus, setTranslatedStatus] = useState(false);

    useEffect(() => setIsStarred(message.starred), [message.starred]);

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

     //Translate Text 
    async function translate(message : string) { 
    //     const original = document.getElementById(message);
    //     if(translatedStatus) {
    //         if(original) original.innerHTML = message;
    //     } else {
    //         const locales = {Spanish: "es", Korean: "ko", Japanese: "ja", English: "en", Chinese: "zh", French: "fr"};  
    //         const res = await fetch("https://translate.terraprint.co/translate", {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 q: message,
    //                 source: locales[selectedLanguage as keyof typeof locales],
    //                 target: "en",
    //                 format: "text"
    //             }),
    //             headers: { "Content-Type": "application/json" }
    //         });
    //         const datas = await res.json();
    //         if(original) original.innerHTML = datas['translatedText'];
    //     }
    //     setTranslatedStatus(!translatedStatus);
    }

    let isUserMessage = message.role === "user";
    return (
        <>
            <div className={isUserMessage ? "user-text-wrapper" : "bot-text-wrapper"}>
                <p className={isUserMessage ? "user-text" : "bot-text"} id={message.content}>{message.content}</p>
                <div className={isUserMessage ? "message-tools-user-wrapper" : "message-tools-bot-wrapper"}>
                    <div id="message-tools-bot">
                        <button className="message-tools-button" id="message-fav" onClick={handleStarClick}>{<FontAwesomeIcon icon={isStarred ? faStarReg : faStarSolid} />}</button>
                        <button className="message-tools-button" id="message-listen" onClick={() => speak(message.content)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                        <button className="message-tools-button" id="message-translate" onClick={() => translate(message.content)}>{<FontAwesomeIcon icon={faLanguage} />}</button>
                    </div>
                </div>
            </div>
        </>
    );
}