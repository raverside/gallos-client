import {IonContent, IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon} from '@ionic/react';
import './Auth.css';
import React, {useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {AppContext} from "../../State";
import logo from '../../img/doublerooster.png';
import {paperPlane as paperPlaneIcon} from "ionicons/icons";
import { useTranslation } from 'react-multi-lang';
import LanguagePicker from "../../components/LanguagePicker";

const Auth: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        if (state.user?.id) {
            history.replace("/");
        }
    }, [state.user?.id]);

    return (
        <IonPage>
            <IonContent fullscreen id="auth-content">
                <LanguagePicker />
                <IonGrid className="auth-grid">
                    <IonRow>
                        <IonCol>
                            <IonImg src={logo} className="rooster-logo" />
                            {/*<IonText className="auth-welcome">{t('auth.welcome_text')}</IonText>*/}
                            {/*<IonText className="auth-welcome-subtext">{t('auth.welcome_subtext')}*/}
                            {/*    <IonButton expand="block" color="tertiary" href="https://telegram.me/gallosclub" target="_blank">*/}
                            {/*        <IonIcon icon={paperPlaneIcon} style={{marginRight: "10px", fontSize: "14px"}} /> {t('auth.welcome_button')}*/}
                            {/*    </IonButton>*/}
                            {/*</IonText>*/}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton routerLink="/register" expand="block">{t('auth.register')}</IonButton>
                            <IonButton routerLink="/login" expand="block" fill="outline">{t('auth.login')}</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Auth;
