// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css";
import useRegistrationCheck from "../hooks/useRegistrationCheck";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchConversationData from "../hooks/useFetchConversationData";
import SavedMessage from "../components/SavedMessage";

export default function Notes() {
    useRegistrationCheck();
    const [user, setUser] = useFetchUserData();
    const [conversations, setConversations] = useFetchConversationData((user === null) ? "" : user.targetLanguages[0], true);

    function handleDelete(message) {
        message.setStarred(false);
        setConversations([...conversations]);
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
                {notes}
            </div>
        </>
    );
}