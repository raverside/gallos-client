import {
    IonButton,
    IonContent,
    IonIcon,
    IonPage,
    IonText,
} from '@ionic/react';
import {paperPlane as paperPlaneIcon} from "ionicons/icons";
import React from "react";
import ArrowHeader from '../components/Header/ArrowHeader';

import './Contact.css';
import {useTranslation} from "react-multi-lang";

const Contact: React.FC = () => {
    const t = useTranslation();

    return (
        <IonPage>
            <ArrowHeader title={t('contact.header')} />
            <IonContent fullscreen id="contact-content">
                <div className="contact-wrapper">
                    <IonText className="restore-passcode-text">{t('contact.text')}</IonText>
                    <IonButton expand="block" color="tertiary" href="https://telegram.me/gallosclub" target="_blank">
                        <IonIcon icon={paperPlaneIcon} style={{marginRight: "10px", fontSize: "14px"}} /> {t('contact.button')}
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Contact;
