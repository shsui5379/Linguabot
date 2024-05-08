import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faLanguage, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import useTranslation from "../hooks/useTranslation";
import messagetools from "../utilities/messagetools";

export default function SavedMessage({ message, selectedLanguage, userLanguage }) {
    const [noteInput, setNoteInput] = useState(message.note);
    const [shouldSync, setShouldSync] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showTranslation, translatedText, toggleTranslation] = useTranslation(message.content, selectedLanguage, userLanguage);
    const syncInitiated = useRef(false);

    useEffect(() => {
        if (shouldSync) {
            message.setNote(noteInput);
            setShouldSync(false);
        }
    }, [shouldSync, noteInput, message]);

    function handleNoteInput(event) {
        setNoteInput(event.target.value);
        if (!syncInitiated.current) {
            syncInitiated.current = true;
            setTimeout(() => {
                setShouldSync(true);
                syncInitiated.current = false;
            }, 5000);
        }
    }

    function speak() {
        if (isSpeaking) return;

        setIsSpeaking(true);
        let speaker = messagetools.speak(message.content, selectedLanguage);

        speaker!.onend = () => setIsSpeaking(false);
    }

    return (
        <div className="saved-message">
            <div className="saved-message-text">
                <p className="saved-text"> {showTranslation ? translatedText : message.content} </p> {/** display the text */}
                <div className="saved-text-tools">
                    <button className={`saved-text-tools-button saved-text-listen ${isSpeaking ? "speaking-active" : ""}`} title="Listen" onClick={speak}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                    <button className={`saved-text-tools-button saved-text-translate ${showTranslation ? "translation-active" : ""}`} title="Translate" onClick={toggleTranslation}>{<FontAwesomeIcon icon={faLanguage} />}</button>
                    <button className="saved-text-tools-button saved-text-delete" title="Delete">{<FontAwesomeIcon icon={faX} />}</button>
                </div>
            </div>
            <form className="saved-message-notes">
                <textarea
                    name="note"
                    onChange={handleNoteInput}
                    placeholder="Add a note..."
                    className="notes-input"
                    maxLength={1024}
                >
                    {/** display the note */}
                    {noteInput ?? ""}
                </textarea>
            </form>
        </div>
    );
}