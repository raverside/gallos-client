import {
    IonButton, IonButtons, IonIcon,
    IonModal, IonTitle, IonToolbar, IonContent, IonText
} from '@ionic/react';

import React, {useState} from "react";
import {closeOutline as closeIcon} from "ionicons/icons";
import PhoneInput from 'react-phone-input-2';
import {updateUserProfile} from "../../api/Users";
import {formatPasscode} from '../utils';

import './UpdateProfile.css';
import {useTranslation} from "react-multi-lang";

type UpdateProfileProps = {
    user: {
        id: string;
        phone: string;
        passcode: string;
    };
    updateUser: () => void;
};

const UpdateProfile: React.FC<UpdateProfileProps> = ({user, updateUser}) => {
    const t = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>(user.phone || "");
    const [passcode, setPasscode] = useState<string>(user.passcode);
    const [showPasscode, setShowPasscode] = useState<boolean>(false);

    const canSubmit = () => {
        return phone && phone.length >= 5 && phone.length <= 15;
    }

    const generatePasscode = () => {
        const generatedPasscode = Math.random().toString(36).substr(2, 9);
        if (generatedPasscode && generatedPasscode.length === 9) {
            setPasscode(generatedPasscode);
            setShowPasscode(true);
        } else generatePasscode();
    }

    const Submit = async () => {
        if (!canSubmit()) return;
        updateUserProfile(user.id, phone, passcode);
        updateUser();
        setShowModal(false);
    }

    return (<>
        <IonButton fill="clear" onClick={() => setShowModal(true)}>{t('users.update')}</IonButton>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="update-profile-modal">
            <IonToolbar className="modal-header">
                <IonTitle className="page-title">{t('users.account_information')}</IonTitle>
                <IonButtons slot="start">
                    <IonIcon
                        icon={closeIcon}
                        className="update-profile-close-icon"
                        slot="start"
                        onClick={() => setShowModal(false)}
                    />
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="update-profile-save" onClick={Submit}>{t('users.save')}</IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <div className="update-profile-form">
                    <IonText className="update-label">{t('users.phone')}</IonText>
                    <PhoneInput
                        country={'us'}
                        countryCodeEditable={false}
                        placeholder={t('users.phone')}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                    />

                    <IonText className="update-label">{t('users.passcode')}</IonText>
                    <IonText>{showPasscode ? formatPasscode(passcode) : "*** *** ***"}</IonText>
                    <IonButton className="update-toggle-passcode" fill="clear" onClick={() => setShowPasscode(!showPasscode)}>{showPasscode ? t('auth.hide') : t('auth.show')}</IonButton>
                    <IonButton expand="block" className="generate-passcode" onClick={generatePasscode}>{t('users.generate_passcode')}</IonButton>
                </div>
            </IonContent>
        </IonModal>
    </>);
};

export default UpdateProfile;
