import React, {useState, useEffect} from 'react';
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
    IonButton, IonSelectOption, IonSelect,
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import moment from "moment";

import {useTranslation} from "react-multi-lang";
import {announceMatchResult} from "../../api/Events";

type TeamFormData = {
    id?: string;
    result?: number|null;
    match_time?: number|null;
};
type EventProps = {
    close: () => void;
    fetchEvent: () => void;
    match?: TeamFormData|false;
};

const MatchResultsEditor: React.FC<EventProps> = ({fetchEvent, close, match = false}) => {
    const t = useTranslation();
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [formData, setFormData] = useState<TeamFormData>({
        id: match ? match.id : undefined,
        result: match ? match.result : null,
        match_time: match ? match.match_time : null
    });

    useEffect(() => {
        setShowTimePicker((formData.result === 0 || formData.result === 1 || formData.result === 2));
    }, [formData.result]);

    const canSubmit = () => {
        let isFormFilled = true;

        if (formData.result === null) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        if (!formData.id) return false;
        await announceMatchResult(formData.id, formData.result!, formData.match_time || 0);
        fetchEvent();
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title">{t('judge.results')}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('judge.save')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                <IonItemDivider>{t('judge.select_result')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="membership" value={formData.result} onIonChange={(e) => setFormData((currentFormData:any) => ({...currentFormData, result: e.detail.value}))} placeholder={t('judge.select_result')}>
                        <IonSelectOption value={0}>{t('judge.blue_wins')}</IonSelectOption>
                        <IonSelectOption value={1}>{t('judge.white_wins')}</IonSelectOption>
                        <IonSelectOption value={2}>{t('judge.draw')}</IonSelectOption>
                        <IonSelectOption value={3}>{t('judge.cancelled')}</IonSelectOption>
                    </IonSelect>
                </IonItem>
                {showTimePicker && <>
                    <IonItemDivider>{t('judge.match_time')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            type="number"
                            value={formData.match_time}
                            min="0"
                            max="659"
                            onIonChange={(e) => setFormData((currentFormData:any) => ({...currentFormData, match_time: e.detail.value}))}
                        />
                    </IonItem>
                </>}
            </IonList>
        </IonContent>
    </>);
};

export default MatchResultsEditor;
