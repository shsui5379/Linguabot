// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css";
import useRegistrationCheck from "../hooks/useRegistrationCheck";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchNotes from "../hooks/useFetchNotes";
import SavedMessage from "../components/SavedMessage";

export default function Notes() {
    useRegistrationCheck();
    const [user, setUser] = useFetchUserData();
    const [messages, setMessages] = useFetchNotes((user === null) ? "" : user.targetLanguages[0]);

    function handleDelete(message) {
      const confirmDelete = window.confirm('Are you sure you want to unsave this note?');
      if (confirmDelete) {
        message.setStarred(false);
        setMessages([...messages]);
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
        setMessages([]);
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
    messages
      .filter((message) => message.starred)
      .forEach((message) => notes.push(<SavedMessage key={message.id} message={message} selectedLanguage={user.targetLanguages[0]} userLanguage={user.userLanguage} onDelete={() => handleDelete(message)} />));

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