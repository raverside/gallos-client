import {
    IonContent,
    IonPage,
    IonText,
    IonRow, IonCol, IonGrid, IonButton, IonInput
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './Auth.css';
import ArrowHeader from '../../components/Header/ArrowHeader';
import {checkPhone, registerUser} from '../../api/Auth';
import {formatPasscode} from "../../components/utils";
import {AppContext} from "../../State";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";
import { useTranslation } from 'react-multi-lang';

const Register: React.FC = () => {
    const t = useTranslation();
    const [stage, setStage] = useState(0);
    const [phone, setPhone] = useState<string>("");
    const [passcode, setPasscode] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string|boolean>(false);
    const { state, dispatch } = useContext(AppContext);
    const history = useHistory();

    useEffect(() => {
        if (state.user?.id) {
            history.replace("/user_profile");
        }
    }, [state.user?.id]);

    const submitPhone = async () => {
        const response = await checkPhone(phone);
        if (response.error) {
            setError(response.error);
        } else if (response.success) {
            setStage(1);
        }
    }

    const submitRegister = async () => {
        const response = await registerUser(phone, passcode.replace(/\s+/g, ''));
        if (response.user && response.token) {
            dispatch({
                type: 'setUser',
                user: response.user
            });
            Cookies.set('token', response.token, { expires: 7 });
        }
    }

    const generatePasscode = () => {
        const generatedPasscode = Math.random().toString(36).substr(2, 9);
        if (generatedPasscode && generatedPasscode.length === 9) {
            setPasscode(generatedPasscode);
            setShowPassword(true);
        } else generatePasscode();
    }

    return (
        <IonPage>
            <ArrowHeader title={t('auth.register')} backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    {(stage === 0) ? <>
                        <IonRow>
                            <IonCol>
                                <IonText className="register-phone-label">{t('auth.register_phone_label')}</IonText>
                                <PhoneInput
                                    country={'us'}
                                    countryCodeEditable={false}
                                    placeholder={t('auth.register_phone_placeholder')}
                                    value={phone}
                                    onChange={(phone) => {setError(false);setPhone(phone)}}
                                />
                                {error && <IonText color="primary" className="auth-error">{t('auth.register_error')}</IonText>}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" disabled={phone.length < 5} onClick={submitPhone}>{t('auth.register_next')}</IonButton>
                            </IonCol>
                        </IonRow>
                    </> : <>
                        <IonRow>
                            <IonCol className="register-col-wrapper">
                                <IonText className="register-phone-label">{t('auth.register_set_passcode')}</IonText>
                                <IonText className="register-phone-subtext">{t('auth.register_set_passcode_hint')}</IonText>
                                <div style={{position: "relative", textAlign:"left"}}>
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
                                <IonButton expand="block" fill="clear" className="generate-passcode" onClick={generatePasscode}>{t('auth.auto_passcode')}</IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" disabled={passcode.length !== 11} onClick={submitRegister}>{t('auth.register')}</IonButton>
                            </IonCol>
                        </IonRow>
                    </>}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Register;
