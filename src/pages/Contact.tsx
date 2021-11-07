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

const Contact: React.FC = () => {

    return (
        <IonPage>
            <ArrowHeader title="Contact Us" />
            <IonContent fullscreen id="contact-content">
                <div className="contact-wrapper">
                    <IonText className="restore-passcode-text">Write to us on Telegram if you have any inquiries or suggestions</IonText>
                    <IonButton expand="block" color="tertiary" href="https://telegram.me/gallosclub" target="_blank">
                        <IonIcon icon={paperPlaneIcon} style={{marginRight: "10px", fontSize: "14px"}} /> Contact Us
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Contact;
