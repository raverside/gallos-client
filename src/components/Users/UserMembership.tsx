import {
    IonButton, IonModal, IonContent, IonToolbar, IonButtons, IonTitle, IonHeader, IonIcon, IonLabel, IonText
} from '@ionic/react';

import React, {useState} from "react";

import './UserMembership.css';
import {closeOutline as closeIcon} from "ionicons/icons";
import {useTranslation} from "react-multi-lang";

type UpdateProfileProps = {
    user: {
        id: string;
        username: string;
    };
};

const UserMembership: React.FC<UpdateProfileProps> = ({user}) => {
    const t = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);

    return (<>
        <IonButton fill="clear" onClick={() => setShowModal(true)}>{t('membership.see_details')}</IonButton>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="user-membership-modal">
            <IonHeader>
                <IonToolbar className="modal-header">
                    <IonButtons slot="start">
                        <IonIcon
                            icon={closeIcon}
                            className="membership-close-icon"
                            slot="start"
                            size="large"
                            onClick={() => setShowModal(false)}
                        />
                    </IonButtons>
                    <IonTitle className="page-title"><p>{t('membership.membership')}</p><p className="page-subtitle">{user.username}</p></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="user-membership">
                    <IonLabel className="membership-status-label">{t('membership.membership_status')}</IonLabel>
                    <IonText className="membership-status-membership" color="gold">Gold</IonText>
                    <IonText className="membership-status-date">Starts on 03/09/2021</IonText>
                    <IonText className="membership-status-date">Ends on 03/09/2022</IonText>
                </div>
            </IonContent>
        </IonModal>
    </>);
};

export default UserMembership;
