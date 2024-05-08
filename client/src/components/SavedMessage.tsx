import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faLanguage, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

export default function SavedMessage({ message, selectedLanguage, userLanguage }) {
    const [noteInput, setNoteInput] = useState(message.note);
    const [shouldSync, setShouldSync] = useState(false);
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

    return (
        <div className="saved-message">
            <div className="saved-message-text">
                <p className="saved-text"> {message.content} </p> {/** display the text */}
                <div className="saved-text-tools">
                    <button className="saved-text-tools-button saved-text-listen" title="Listen">{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                    <button className="saved-text-tools-button saved-text-translate" title="Translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
                    <button className="saved-text-tools-button saved-text-delete" title="Delete">{<FontAwesomeIcon icon={faX} />}</button>
                </div>
            </div>
            <form className="saved-message-notes">
                <textarea
                    name="note"
                    onChange={handleNoteInput}
                    placeholder="Add a note..."
                    className="notes-input">
                    {/** display the note */}
                    {noteInput ?? ""}
                </textarea>
            </form>
        </div>
    );
}