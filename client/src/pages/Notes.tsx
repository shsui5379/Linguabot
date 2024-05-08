// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faLanguage, faX } from "@fortawesome/free-solid-svg-icons";
import messagetools from "../utilities/messagetools";
import useRegistrationCheck from "../hooks/useRegistrationCheck";

export default function Notes() {
    useRegistrationCheck();
    // Update unique notes onchange
    function saveNewNote() {
        return;
    }

    // Display the saved messages with their notes
    var saved_messages_and_notes = ["hello"]; // this needs to change to a map(?) so that the text and its note are together
    var saved_messages_and_notes_display = [saved_messages_and_notes.map(item =>
        <div className="saved-message">
            <div className="saved-message-text">
                <p className="saved-text"> 안녕하세요 </p> {/** display the text */}
                <div className="saved-text-tools">
                    <button className="saved-text-tools-button saved-text-listen" title="Listen">{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                    <button className="saved-text-tools-button saved-text-translate" title="Translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
                    <button className="saved-text-tools-button saved-text-delete" title="Delete">{<FontAwesomeIcon icon={faX} />}</button>
                </div>
            </div>
            <form className="saved-message-notes">
                <textarea
                    name="note"
                    // onChange={saveNewNote()}
                    placeholder="Add a note..."
                    className="notes-input">
                    {/** display the note */}
                    This means "hello"
                </textarea>
            </form>
        </div>
    )];


    return (
        <>
            <NavigationBar />
            <div id="notes-wrapper">
                {saved_messages_and_notes_display}
            </div>
        </>
    );
}