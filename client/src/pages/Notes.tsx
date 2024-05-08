// Notes component
import NavigationBar from "../components/NavigationBar";
import "../css/Notes.css"
import useRegistrationCheck from "../hooks/useRegistrationCheck";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchConversationData from "../hooks/useFetchConversationData";
import SavedMessage from "../components/SavedMessage";

export default function Notes() {
    useRegistrationCheck();
    const [user, setUser] = useFetchUserData();
    const [conversations, setConversations] = useFetchConversationData((user === null) ? "" : user.targetLanguages[0], true);

    // Display the saved messages with their notes
    let notes: any = [];
    conversations.forEach((conversation) => {
        conversation.messages.forEach((message) => {
            notes.push(<SavedMessage key={message.id} message={message} selectedLanguage={user.targetLanguages[0]} userLanguage={user.userLanguage} />)
        });
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