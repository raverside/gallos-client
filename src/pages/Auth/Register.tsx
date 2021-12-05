import {
    IonButtons,
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
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

const Register: React.FC = () => {
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
            <ArrowHeader title="Create an Account" backHref="/auth"/>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    {(stage === 0) ? <>
                        <IonRow>
                            <IonCol>
                                <IonText className="register-phone-label">Enter your phone number</IonText>
                                <PhoneInput
                                    country={'us'}
                                    countryCodeEditable={false}
                                    placeholder="Your phone number"
                                    value={phone}
                                    onChange={(phone) => {setError(false);setPhone(phone)}}
                                />
                                {error && <IonText color="primary" className="auth-error">Phone number is already registered. Please enter another phone number</IonText>}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" disabled={phone.length < 5} onClick={submitPhone}>Next</IonButton>
                            </IonCol>
                        </IonRow>
                    </> : <>
                        <IonRow>
                            <IonCol>
                                <IonText className="register-phone-label">Set your passcode</IonText>
                                <IonText className="register-phone-subtext">Create a 9 characters passcode. It should be something others couldn't guess</IonText>
                                <div style={{position: "relative"}}>
                                    <IonInput
                                        placeholder="Passcode"
                                        type={showPassword ? "text" : "password"}
                                        value={passcode}
                                        onIonChange={e => {setError(false); setPasscode(formatPasscode(e.detail.value!))}}
                                        clearOnEdit={true}
                                        maxlength={11}
                                        style={{marginTop: "15px"}}
                                        className={error ? "auth-error-border" : ""}
                                    />
                                    <IonButton className="toggle-passcode" fill="clear" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</IonButton>
                                </div>
                                <IonButton expand="block" fill="clear" className="generate-passcode" onClick={generatePasscode}>Or automatically generate passcode</IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" disabled={passcode.length !== 11} onClick={submitRegister}>Register</IonButton>
                            </IonCol>
                        </IonRow>
                    </>}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Register;
