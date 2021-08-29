import {
    IonButtons,
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonText,
    IonRow, IonCol, IonGrid, IonButton
} from '@ionic/react';
import React from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './Auth.css';
import ArrowHeader from '../../components/Header/ArrowHeader';

const Register: React.FC = () => {
    return (
        <IonPage>
            <ArrowHeader title="Create an Account" backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    <IonRow>
                        <IonCol>
                            <IonText className="register-phone-label">Enter your phone number</IonText>
                            <PhoneInput
                                country={'us'}
                                countryCodeEditable={false}
                                placeholder="Your phone number"
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton expand="block" disabled>Next</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Register;
