import {
    IonContent,
    IonPage,
    IonButton,
    IonText,
    IonIcon
} from '@ionic/react';
import React from "react";
import './Auth.css';
import {paperPlane as paperPlaneIcon} from 'ionicons/icons';
import ArrowHeader from '../../components/Header/ArrowHeader';
import {useTranslation} from "react-multi-lang";

const ForgotPasscode: React.FC = () => {
    const t = useTranslation();

    return (
        <IonPage>
            <ArrowHeader title="Forgot Passcode" backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonText className="restore-passcode-text">{t('auth.forgot_passcode_text')}</IonText>
                <IonButton expand="block" color="tertiary" href="https://telegram.me/gallosclub" target="_blank">
                    <IonIcon icon={paperPlaneIcon} style={{marginRight: "10px", fontSize: "14px"}} /> {t('auth.forgot_passcode_button')}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default ForgotPasscode;
