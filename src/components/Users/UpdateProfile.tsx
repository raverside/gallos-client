import {
    IonButton, IonButtons, IonIcon,
    IonModal, IonTitle, IonToolbar, IonContent, IonText
} from '@ionic/react';

import React, {useState} from "react";
import {closeOutline as closeIcon} from "ionicons/icons";
import PhoneInput from 'react-phone-input-2';
import {updateUserProfile} from "../../api/Users";

import './UpdateProfile.css';

type UpdateProfileProps = {
    user: {
        id: string;
        phone: string;
    };
    updateUser: () => void;
};

const UpdateProfile: React.FC<UpdateProfileProps> = ({user, updateUser}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>(user.phone || "");
    const [newPasscode, setNewPasscode] = useState<string|false>(false);

    const canSubmit = () => {
        return phone && phone.length >= 5 && phone.length <= 15;
    }

    const generatePasscode = () => {
        const passcode = Math.random().toString(36).substr(2, 9);
        if (passcode && passcode.length === 9) {
            setNewPasscode(passcode);
        } else generatePasscode();
    }

    const Submit = async () => {
        if (!canSubmit()) return;
        updateUserProfile(user.id, phone, newPasscode);
        updateUser();
        setShowModal(false);
    }

    return (<>
        <IonButton fill="clear" onClick={() => setShowModal(true)}>Update</IonButton>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="update-profile-modal">
            <IonToolbar className="modal-header">
                <IonTitle className="page-title">Account Information</IonTitle>
                <IonButtons slot="start">
                    <IonIcon
                        icon={closeIcon}
                        className="update-profile-close-icon"
                        slot="start"
                        onClick={() => setShowModal(false)}
                    />
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="update-profile-save" onClick={Submit}>Save</IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <div className="update-profile-form">
                    <IonText className="update-label">Phone number</IonText>
                    <PhoneInput
                        country={'us'}
                        countryCodeEditable={false}
                        placeholder="Phone number"
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                    />

                    <IonText className="update-label">Passcode</IonText>
                    <IonText>{newPasscode || "*********"}</IonText>
                    <IonButton expand="block" className="generate-passcode" onClick={generatePasscode}>Generate a New Passcode</IonButton>
                </div>
            </IonContent>
        </IonModal>
    </>);
};

export default UpdateProfile;
