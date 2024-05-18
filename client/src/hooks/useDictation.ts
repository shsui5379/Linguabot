import { useEffect, useRef, useState } from "react";
import { Language } from "../types/Language";

export default function useDictation(selectedLanguage: Language | "", handleSetInputField: (input: string) => undefined) {
    const [active, setActive] = useState(false);
    const dictation = useRef(null);

    useEffect(() => {
        if (selectedLanguage === "") {
            return;
        }

        const locales = {
            Spanish: "es-ES",
            Korean: "ko-KR",
            Japanese: "ja-JA",
            English: "en-US",
            Mandarin: "zh-CN",
            French: "fr-FR"
        };

        if (dictation.current !== null) {
            dictation.current.lang = locales[selectedLanguage as keyof typeof locales];
            return;
        }

        dictation.current = new (window.speechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        if (dictation.current === null) {
            return;
        }

        dictation.current.onerror = (e) => {
            if (e.error === "language-not-supported") {
                alert("Your browser doesn't support dictation for " + selectedLanguage);
            }
        }
        dictation.current.lang = locales[selectedLanguage as keyof typeof locales];
        dictation.current.interimResults = true;
        dictation.current.maxAlternatives = 1;
        dictation.current.onresult = (event) => {
            let message = Array.from(event.results).map((result) => result[0].transcript).join("");
            handleSetInputField(message);
        };
        dictation.current.onspeechend = () => {
            setActive(false);
            dictation.current.stop();
        };
        dictation.current.onerror = (event) => {
            setActive(false);
        };
    }, [selectedLanguage, handleSetInputField]);

    function start() {
        if (dictation.current === null) {
            alert("Sorry, your browser doesn't support dictation!");
            return;
        }

        setActive(true);
        dictation.current.start();
    }

    function stop() {
        if (dictation.current === null) {
            return;
        }

        setActive(false);
        dictation.current.stop();
    }

    function toggle() {
        if (active) {
            stop();
        }
        else {
            start();
        }
    }

    return [active, toggle];
}