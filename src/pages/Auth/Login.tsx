import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonImg,
    IonInput, IonLoading,
    IonPage,
    IonRouterLink,
    IonRow,
    IonText
} from '@ionic/react';
import logo from "../../img/logo_club.png";
import PhoneInput from "react-phone-input-2";
import {formatPasscode} from "../../components/utils";
import React, {useContext, useEffect, useState} from "react";
import {login} from "../../api/Auth";
import Cookies from "js-cookie";
import {AppContext} from "../../State";
import {useHistory} from "react-router-dom";
import ArrowHeader from "../../components/Header/ArrowHeader";
import { useTranslation } from 'react-multi-lang';

const Login: React.FC = () => {
    const t = useTranslation();
    const { state, dispatch } = useContext(AppContext);
    const history = useHistory();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>("");
    const [passcode, setPasscode] = useState<string>("");
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string|boolean>(false);

    const Submit = async () => {
        setSubmitDisabled(true);
        setShowLoading(true);
        const response = await login(phone, passcode);
        if (response.error) {
            setError(response.error);
            setShowLoading(false);
        } else if (response.token && response.user) {
            dispatch({
                type: 'setUser',
                user: response.user
            });
            Cookies.set('token', response.token, { expires: 7 });
            setShowLoading(false);
        }
    }

    useEffect(() => {
        if (state.user?.id) {
            history.replace("/");
        }
    }, [state.user?.id]);

    useEffect(() => {
        setSubmitDisabled(passcode.length !== 11 || phone.length < 3);
    }, [passcode, phone]);

    return (
        <IonPage>
            <ArrowHeader title={t('auth.login')} backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    <IonRow>
                        <IonCol>
                            <IonImg src={logo} className="logo_club" />
                            <PhoneInput
                                placeholder={t('auth.placeholder_phone')}
                                value={phone}
                                onChange={(phone) => {setError(false); setPhone(phone)}}
                                inputClass={error ? "auth-error-border" : ""}
                            />
                            <div style={{position: "relative"}}>
                                <IonInput
                                    placeholder={t('auth.placeholder_passcode')}
                                    type={showPassword ? "text" : "password"}
                                    value={passcode}
                                    onIonChange={e => {setError(false); setPasscode(formatPasscode(e.detail.value!))}}
                                    clearOnEdit={true}
                                    maxlength={11}
                                    style={{marginTop: "15px"}}
                                    className={error ? "auth-error-border" : ""}
                                />
                                <IonButton className="toggle-passcode" fill="clear" onClick={() => setShowPassword(!showPassword)}>{showPassword ? t('auth.hide') : t('auth.show')}</IonButton>
                            </div>
                            {error && <IonText color="primary" className="auth-error">{t('auth.error')}</IonText>}
                            <IonRouterLink className="forgot-passcode" routerLink="/forgot_passcode">{t('auth.forgot_passcode')}</IonRouterLink>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton
                                onClick={Submit}
                                disabled={submitDisabled}
                                expand="block"
                            >{t('auth.login')}</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;
