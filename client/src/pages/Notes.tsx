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
            <div className="notes-messages-tools">
                <p className="notes-messages"> 안녕하세요 </p>
                <div className="notes-tools">
                    <button className="notes-message-tools-button" id="message-listen">{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
                    <button className="notes-message-tools-button" id="message-translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
                    <button className="notes-message-tools-button" id="message-delete">{<FontAwesomeIcon icon={faX} />}</button>
                </div>
            </div>
            <div className="notes">
                <input type="text"
                       value="This means 'hello'"
                       className="notes-input">
                </input>
            </div>
        </div>
    </>
    );
}