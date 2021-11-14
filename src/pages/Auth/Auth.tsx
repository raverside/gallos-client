import {IonContent, IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol} from '@ionic/react';
import './Auth.css';
import {useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {AppContext} from "../../State";
import logo from '../../img/doublerooster.png';

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
                            <IonText className="auth-welcome">Próximamente en 2021 🚀</IonText>
                            <IonText className="auth-welcome-subtext">Registre su equipo ahora poniéndose en contacto con nosotros por vía de Telegram: <span className="red_telegram">+1 849-876-9090</span></IonText>
                        </IonCol>
                    </IonRow>
                    {/*<IonRow>*/}
                    {/*    <IonCol>*/}
                    {/*        <IonButton routerLink="/register" expand="block">Create Account</IonButton>*/}
                    {/*        <IonButton routerLink="/login" expand="block" fill="outline">Log In</IonButton>*/}
                    {/*    </IonCol>*/}
                    {/*</IonRow>*/}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Auth;
