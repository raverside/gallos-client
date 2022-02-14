import React, {useContext, useState} from 'react';
import {
    IonButtons,
    IonContent,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonItemDivider,
    IonInput,
    IonButton,
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";

import './TeamOwnerEditor.css';
import {addTeamOwnerTeam, updateTeamOwnerTeam} from '../../api/TeamOwners';
import {useTranslation} from "react-multi-lang";
import {AppContext} from "../../State";

type TeamFormData = {
    id?: string;
    name: string;
};
type EventProps = {
    close: () => void;
    fetchTeamOwner: () => void;
    teamOwnerId?: string;
    team?: TeamFormData|false;
};

const TeamEditor: React.FC<EventProps> = ({teamOwnerId, fetchTeamOwner, close, team = false}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [formData, setFormData] = useState<TeamFormData>({
        id: team ? team.id : undefined,
        name: team ? team.name : "",
    });

    const canSubmit = () => {
        let isFormFilled = true;

        if (!formData.name) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        if (!formData.id && !teamOwnerId) return false;
        if (teamOwnerId) {
            const response = await addTeamOwnerTeam(teamOwnerId, [formData.name]);
            if (response.success) {
                fetchTeamOwner();
            }
        } else if (formData.id) {
            const response = await updateTeamOwnerTeam(formData.id, formData.name);
            if (response.success) {
                fetchTeamOwner();
            }
        }
        state.socket?.emit('updateEvents');
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title">{formData.id ? t('teams.update_team') : t('teams.add_team')}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('teams.submit')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                <IonItemDivider>{t('teams.name')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.name}
                        className="fullsize-input"
                        placeholder={t('teams.name')}
                        onIonChange={(e) => setFormData({...formData, name: e.detail.value!})}
                    />
                </IonItem>
            </IonList>
        </IonContent>
    </>);
};

export default TeamEditor;
