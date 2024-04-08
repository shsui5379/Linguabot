// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faLanguage, faX } from "@fortawesome/free-solid-svg-icons";

export default function Notes() {
    return(
    <>
        <NavigationBar/>
        {/** Can include checkboxes */}
        <div id="notes-wrapper">
            <div className="saved-message">
                <div className="saved-message-text">
                    <p className="saved-text"> 안녕하세요 </p>
                    <div className="saved-text-tools">
                        <button className="saved-text-tools-button" id="saved-text-listen">{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                        <button className="saved-text-tools-button" id="saved-text-translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
                        <button className="saved-text-tools-button" id="saved-text-delete">{<FontAwesomeIcon icon={faX} />}</button>
                    </div>
                </div>
                <form className="saved-message-notes">
                    <textarea
                        name="note"
                        placeholder="Add a note..."
                        className="notes-input">
                        This means "hello"
                    </textarea>                    
                </form>
            </div>
        </div>
        
    </>
    );
}