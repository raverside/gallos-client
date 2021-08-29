import {
    IonButton,
    IonContent,
    IonIcon,
    IonPage,
    IonText,
} from '@ionic/react';
import {paperPlane as paperPlaneIcon} from "ionicons/icons";
import {logoYoutube as youtubeIcon} from "ionicons/icons";
import React from "react";
import ArrowHeader from '../components/Header/ArrowHeader';

import './Contact.css';

const Contact: React.FC = () => {

    return (
        <IonPage>
            <ArrowHeader title="Contact Us" />
            <IonContent fullscreen id="contact-content">
                <div className="contact-wrapper">
                    <IonText className="contact-text">Reach out to us on these platforms</IonText>
                    <div className="contact-option">
                        <div className="contact-option_label"><IonIcon icon={paperPlaneIcon} color="tertiary" style={{marginRight: "10px", fontSize: "14px"}} /> Telegram</div>
                        <IonButton fill="clear" color="dark" href="https://telegram.me/raverside" target="_blank">+1 (849) 986 4545</IonButton>
                    </div>
                    <div className="contact-option">
                        <div className="contact-option_label"><IonIcon icon={youtubeIcon} color="primary" style={{marginRight: "10px", fontSize: "14px"}} /> Youtube</div>
                        <IonButton fill="clear" color="dark" href="https://www.youtube.com/c/GallosClub" target="_blank">Gallos Club</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Contact;
