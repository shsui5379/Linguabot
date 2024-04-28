import UserName from "./UserName";
import SelectLanguage from "./SelectLanguage";
import { useState } from "react";
import User from "../types/User";
import { useNavigate } from "react-router-dom";
import { Language } from "../types/Language";

export default function SignUpFlow() {
    enum FlowState {
        CHECK_IF_EXISTS,
        NAME_ENTRY,
        TARGET_LANGUAGE_SELECTION,
        FINISHED
    };

    const [flowState, setFlowState] = useState(FlowState.CHECK_IF_EXISTS);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const navigateTo = useNavigate();

    async function createUser(firstName: string, lastName: string, userLanguage: string, targetLanguages: string[]) {
        try {
            return await User.createUser(firstName, lastName, userLanguage as Language, targetLanguages as Language[]);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    if (flowState === FlowState.CHECK_IF_EXISTS) {
        User.fetchUser().then((user) => {
            if (user !== null) {
                navigateTo("/chat");
            } else {
                setFlowState(FlowState.NAME_ENTRY);
            }
        }).catch((error) => {
            if (error.message === "User doesn't exist") {
                setFlowState(FlowState.NAME_ENTRY);
            }
        })
    } else if (flowState === FlowState.NAME_ENTRY) {
        return (
            <UserName
                firstName={firstName}
                lastName={lastName}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setFlowState={() => setFlowState(FlowState.TARGET_LANGUAGE_SELECTION)}
            />
        );
    }
    else if (flowState === FlowState.TARGET_LANGUAGE_SELECTION) {
        return (
            <SelectLanguage
                selected={selectedLanguage}
                setSelected={setSelectedLanguage}
                setFlowState={() => setFlowState(FlowState.FINISHED)}
            />
        );
    }
    else {
        createUser(firstName, lastName, "English", [selectedLanguage]).then(() => navigateTo("/chat"));
    }
}