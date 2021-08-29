import {IonContent, IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol} from '@ionic/react';
import './Auth.css';
import {useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {AppContext} from "../../State";
import logo from '../../img/rooster.png';

const Auth: React.FC = () => {
    const { state } = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        if (state.user?.id) {
            history.push("/");
        }
    }, [state.user?.id]);

    return (
        <IonPage>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    <IonRow>
                        <IonCol>
                            <IonImg src={logo} className="rooster-logo" />
                            <IonText className="auth-welcome">Welcome to Gallos Club</IonText>
                            <IonText className="auth-welcome-subtext">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at.</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton routerLink="/register" expand="block">Create Account</IonButton>
                            <IonButton routerLink="/login" expand="block" fill="outline">Log In</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Auth;
