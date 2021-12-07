import React, { useState } from 'react';
import {IonButtons, IonContent, IonIcon, IonModal, IonTitle, IonToolbar} from '@ionic/react';
import { notificationsOutline as notificationsIcon, closeOutline as closeIcon} from 'ionicons/icons';
import './Notifications.css';
import {useTranslation} from "react-multi-lang";


const Notifications: React.FC = () => {
    const t = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);

    return (<>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonToolbar className="modal-header">
                <IonTitle className="page-title">{t('notifications.notifications')}</IonTitle>
                <IonButtons slot="end">
                    <IonIcon
                        icon={closeIcon}
                        className="notifications-close-icon"
                        slot="end"
                        onClick={() => setShowModal(false)}
                    />
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <p style={{textAlign: 'center'}}>{t('notifications.empty')}</p>
            </IonContent>
        </IonModal>
        <IonIcon
            icon={notificationsIcon}
            className="notifications-icon"
            slot="end"
            onClick={() => setShowModal(true)}
        />
    </>);
};

export default Notifications;
