import UserName from "./UserName";
import SelectLanguage from "./SelectLanguage";
import { useState } from "react";
import User from "../types/User";
import { useNavigate } from "react-router-dom";

export default function SignUpFlow() {
    enum FLOW_STATE {
        USERNAME,
        TARGET_LANGUAGE_SELECTION,
        FINISHED
    };

    const [flowState, setFlowState] = useState(FLOW_STATE.USERNAME);
    const [firstName, setFirstName]= useState('');
    const [lastName, setLastName] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const navigation = useNavigate();

    async function createUser(firstName: string, lastName: string, userLanguage: string, targetLanguages: string[]) {
        try {
            return await User.createUser(firstName, lastName, userLanguage, targetLanguages);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    if (flowState === FLOW_STATE.USERNAME) {
        return (<UserName
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setFlowState={() => setFlowState(FLOW_STATE.TARGET_LANGUAGE_SELECTION)}
            />
        );
    }
    else if (flowState === FLOW_STATE.TARGET_LANGUAGE_SELECTION) {
        return (<SelectLanguage
            selected={selectedLanguage}
            setSelected={setSelectedLanguage}
            setFlowState={() => setFlowState(FLOW_STATE.FINISHED)}
            />
        );
    }
    else {
        createUser(firstName, lastName, "English", [selectedLanguage]);
        navigation("/chat");
    }
}