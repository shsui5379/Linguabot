import { Language } from "../types/Language";

const locales = {
    Spanish: "es-ES",
    Korean: "ko-KR",
    Japanese: "ja-JA",
    English: "en-US",
    Mandarin: "zh-CN",
    French: "fr-FR"
};
const localesShort = {
    Spanish: "es",
    Korean: "ko",
    Japanese: "ja",
    English: "en",
    Mandarin: "zh",
    French: "fr"
};

function speak(message: string, language: Language) {
    // Alert if speech synthesis is not supported by browser
    if (!("speechSynthesis" in window)) {
        alert("Sorry, your browser doesn't support text to speech!");
        return;
    }

    if (speechSynthesis.speaking) return; // already speaking

    let voiceMessage = new SpeechSynthesisUtterance(message);
    voiceMessage.onerror = (e) => {
        if (e.error === "language-unavailable") {
            return alert("Your browser does not support speaking " + language);
        }
    }
    voiceMessage.lang = locales[language as keyof typeof locales];
    voiceMessage.rate = 0.9;
    window.speechSynthesis.speak(voiceMessage);

    return voiceMessage;
}

async function translate(message: string, source: Language, target: Language) {
    const response = await fetch("/api/chat/translate", {
        method: "POST",
        body: JSON.stringify({
            text: message,
            source: localesShort[source as keyof typeof locales],
            target: localesShort[target as keyof typeof locales],
        }),
        headers: { "Content-Type": "application/json" }
    });
    return await response.text();
}

export default { speak, translate }