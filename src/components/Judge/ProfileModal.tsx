import React, {useContext, useState} from 'react';
import {IonButton, IonContent, IonIcon, IonModal} from '@ionic/react';
import {
    closeOutline as closeIcon,
    personCircleOutline as profileIcon
} from 'ionicons/icons';

import {AppContext} from "../../State";
import ProfileWidget from "../Menu/ProfileWidget";

const ProfileModal: React.FC = () => {
    const {dispatch} = useContext(AppContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (<>
        <IonButton fill="clear" className="judge-profile-button" onClick={() => setShowModal(!showModal)}>
            <IonIcon icon={profileIcon}/>
        </IonButton>
        <IonModal cssClass="judge-profile-modal" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonContent>
                <IonIcon
                    icon={closeIcon}
                    className="judge-close-profile-icon"
                    onClick={() => setShowModal(false)}
                />
                <ProfileWidget/>
                <IonButton className="judge-logout" onClick={() => {
                    dispatch({
                        type: 'resetUser',
                    });
                    window.location.replace("/auth_admin");
                }}>Logout</IonButton>
            </IonContent>
        </IonModal>
    </>);
};

export default ProfileModal;
