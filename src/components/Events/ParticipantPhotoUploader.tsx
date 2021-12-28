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
    IonButton,
    IonText,
    IonProgressBar, useIonToast
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import AnimalImagePicker from './AnimalImagePicker';
import {upsertParticipant} from '../../api/Events';

import './ParticipantEditor.css';
import {AppContext} from "../../State";
import {useTranslation} from "react-multi-lang";

type ParticipantFormData = {
    id?: string|undefined;
    event_id: string,
    image?: string|null|undefined;
    image_upload?: File|null;
    image_flipped: boolean;
    cage?: number;
    owner_account_number?: number;
    team_id?: string;
    stadium_id?: string;
    stadium_name?: string;
    betting_amount?: string;
    betting_pref?: string;
    type?: string;
    color?: string;
    cresta?: string;
    alas?: string;
    pata?: string;
    physical_advantage?: string;
    breeder_id?: number;
    breeder_name?: string;
    weight?: string;
    participated_before?: boolean|null;
    status?: string;
    reason?: string;
};
type ParticipantProps = {
    close: () => void;
    fetchEvent: () => void;
    event: any;
    participant?: ParticipantFormData|false;
};

const ParticipantPhotoUploader: React.FC<ParticipantProps> = ({fetchEvent, close, event, participant= false}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [presentToast] = useIonToast();
    const [formData, setFormData] = useState<any>({
        ...participant,
        image: participant ? participant.image : null,
        image_upload: null,
        image_flipped: participant ? participant.image_flipped : false,
    });
    const [uploading, setUploading] = useState<boolean>(false);
    const [complete, setComplete] = useState<boolean>(false);


    const canUpload = () => {
        let isFormFilled = true;

        if (!formData.image_upload) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        setUploading(true);
        const response = await upsertParticipant(formData);
        if (response.participant) {
            fetchEvent();
            setUploading(false);
            setComplete(true);
            setFormData({image: response.participant.image, image_upload: null, image_flipped: response.participant.image_flipped});
            state.socket?.emit('updateEvents');
            presentToast(t('events.saved'), 1000);
        }
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{t('events.upload_photo')}</p></IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    slot="start"
                    className="close-participant-icon"
                    onClick={() => close()}
                />
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                {participant && participant.id && <>
                    <IonItemDivider>{t('events.animal_image')}</IonItemDivider>
                    <IonText className="image-flipper-text">{t('events.animal_image_hint')}</IonText>
                    <IonItem className="animalImagePicker" lines="none">
                        <AnimalImagePicker
                            eventImage={formData.image || null}
                            onPick={(file) => {setFormData((currentFormData:any) => ({...currentFormData, image: null, image_upload: file})); setComplete(false)}}
                            isFlipped={formData.image_flipped || false}
                            setIsFlipped={(isFlipped) => setFormData((currentFormData:any) => ({...currentFormData, image_flipped: isFlipped}))}
                        />
                    </IonItem>
                    {uploading && <IonProgressBar className="progressBar" type="indeterminate" />}
                </>}

                <IonItem lines="none">
                    {complete ?
                        <IonButton expand="block" className="delete-button" color="success" onClick={() => {fetchEvent(); close(); state.socket?.emit('updateEvents');}}>{t('events.upload_complete')}</IonButton> :
                        <IonButton expand="block" className="delete-button" disabled={!canUpload() || uploading} onClick={Submit}>{t('events.upload')}</IonButton>
                    }
                </IonItem>
            </IonList>
        </IonContent>
    </>);
};

export default ParticipantPhotoUploader;
