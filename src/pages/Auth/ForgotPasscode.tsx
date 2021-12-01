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

const ForgotPasscode: React.FC = () => {
    return (
        <IonPage>
            <ArrowHeader title="Forgot Passcode" backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonText className="restore-passcode-text">Write to us on Telegram to recover your password</IonText>
                <IonButton expand="block" color="tertiary" href="https://telegram.me/gallosclub" target="_blank">
                    <IonIcon icon={paperPlaneIcon} style={{marginRight: "10px", fontSize: "14px"}} /> Restore Passcode
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default ForgotPasscode;
