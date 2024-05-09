import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faLanguage, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useTranslation from "../hooks/useTranslation";
import messagetools from "../utilities/messagetools";

export default function SavedMessage({ message, selectedLanguage, userLanguage }) {
    const [noteInput, setNoteInput] = useState(message.note);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showTranslation, translatedText, toggleTranslation] = useTranslation(message.content, selectedLanguage, userLanguage);

    function handleNoteInput(event) {
        setNoteInput(event.target.value);
    }

    function handleSaveNote() {
        message.setNote(noteInput);
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
                    onBlur={handleSaveNote}
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