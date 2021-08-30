import {IonContent, IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonInput, IonRouterLink} from '@ionic/react';
import './Auth.css';
import {useState, useContext, useEffect} from "react";
import {formatPasscode} from '../../components/utils';
import {loginAdmin} from '../../api/Auth';
import Cookies from "js-cookie";
import { AppContext } from '../../State';
import {useHistory} from "react-router-dom";
import logo from '../../img/logo.png';

const Auth: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const history = useHistory();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [passcode, setPasscode] = useState<string>("");
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string|boolean>(false);

    const Submit = async () => {
        setSubmitDisabled(true);
        const response = await loginAdmin(username, passcode);
        if (response.error) {
            setError(response.error);
        } else if (response.token && response.user) {
            dispatch({
                type: 'setUser',
                user: response.user
            });
            Cookies.set('token', response.token, { expires: 7 });
        }
    }

    useEffect(() => {
        if (state.user?.id) {
            history.replace("/");
        }
    }, [state.user?.id]);

    useEffect(() => {
        setSubmitDisabled(passcode.length !== 11 || username.length < 3);
    }, [passcode, username]);

    return (
        <IonPage>
            <IonContent fullscreen id="auth-content">
                <IonGrid className="auth-grid">
                    <IonRow>
                        <IonCol>
                            <IonImg src={logo} className="logo" />
                            <IonText className="admin-logo-subtext">Admin</IonText>
                            <IonInput
                                placeholder="Username"
                                value={username}
                                maxlength={30}
                                onIonChange={e => {setError(false); setUsername(e.detail.value!)}}
                                className={error ? "auth-error-border" : ""}
                            />
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
                            {error && <IonText color="primary" className="auth-error">Incorrect username or password. Please try again.</IonText>}
                            <IonRouterLink className="forgot-passcode" routerLink="/forgot_passcode">Forgot Passcode?</IonRouterLink>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton
                                onClick={Submit}
                                disabled={submitDisabled}
                                expand="block"
                            >Log In</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Auth;
