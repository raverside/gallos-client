import {IonItem, IonImg, IonText, IonList, IonThumbnail} from "@ionic/react";
import {useContext} from "react";
import {AppContext} from "../../State";
import {getImageUrl} from "../utils";

import './ProfileWidget.css';
import {useTranslation} from "react-multi-lang";

const ProfileWidget: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    if (!state.user) return null;

    return (
        <IonItem routerLink={'/user_profile'} className="profile-widget" lines="none">
            <IonThumbnail className="profile-widget_photo">
                <IonImg src={getImageUrl(state.user.photo)} />
            </IonThumbnail>
            <IonList className="profile-widget_info">
                {state.user.username && <IonItem lines="none">
                    <IonText className="profile-widget_info--username">{state.user.username}</IonText>
                </IonItem>}
                <IonItem lines="none">
                    <IonText className="profile-widget_info--bold">{t('users.role_'+state.user.role)}</IonText>
                </IonItem>
                {(state.user.role !== "admin_manager" && state.user.role !== "admin_worker" && state.user.role !== "admin") && <><IonItem lines="none">
                    <IonText className="profile-widget_info--bold">{state.user.stadium?.name}</IonText>
                </IonItem>
                <IonItem lines="none">
                    <IonText color="gold">Gold</IonText>
                </IonItem></>}
                {state.user.phone && <IonItem lines="none">
                    <IonText>+{state.user.phone}</IonText>
                </IonItem>}
            </IonList>
        </IonItem>
    );
};

export default ProfileWidget;
