// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css";
import useRegistrationCheck from "../hooks/useRegistrationCheck";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchConversationData from "../hooks/useFetchConversationData";
import SavedMessage from "../components/SavedMessage";
import { useState } from "react";

export default function Notes() {
    useRegistrationCheck();
    const [user, setUser] = useFetchUserData();
    const [conversations, setConversations] = useFetchConversationData((user === null) ? "" : user.targetLanguages[0], true);
    const [selectedConversation, setSelectedConversation] = useState(0);

    function handleDelete(message) {
      const confirmDelete = window.confirm('Are you sure you want to unsave this note?');
      if (confirmDelete) {
        message.setStarred(false);
        setConversations([...conversations]); 
      };
    } 

    async function handleNewLang(e) {
        let selectedLanguage = e.target.value;
        let targetLanguages = user.targetLanguages;
        let index = targetLanguages.indexOf(selectedLanguage);
        if (index === -1) {
          targetLanguages.unshift(selectedLanguage);
        }
        else {
          [targetLanguages[0], targetLanguages[index]] = [targetLanguages[index], targetLanguages[0]];
        }
        setConversations([]);
        setSelectedConversation(0);
        setUser(await user.setTargetLanguages(targetLanguages));
      }
    
      function getNewLanguage() {
        const languages_supported = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
        return (
          <select title="Select Language" id="notes-lang-select" value={(user === null) ? "" : user.targetLanguages[0]} onChange={handleNewLang}>
            {languages_supported.map((lang, index) =>
              <option value={lang}>{lang}</option>)
            }
          </select>
        )
      }

    // Display the saved messages with their notes
    let notes: any = [];
    conversations.forEach((conversation) => {
        conversation.messages
            .filter((message) => message.starred)
            .forEach((message) => notes.push(<SavedMessage key={message.id} message={message} selectedLanguage={user.targetLanguages[0]} userLanguage={user.userLanguage} onDelete={() => handleDelete(message)} />));
    });

    return (
        <>
            <NavigationBar />
            <div id="notes-wrapper">
              <div id="notes-lang">
                {getNewLanguage()}
              </div>
              {notes}
            </div>
        </>
    );
}