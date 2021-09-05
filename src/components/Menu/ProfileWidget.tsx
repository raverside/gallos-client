import {IonItem, IonImg, IonText, IonList, IonThumbnail} from "@ionic/react";
import {useContext} from "react";
import {AppContext} from "../../State";
import {getImageUrl} from "../utils";

import './ProfileWidget.css';

const ProfileWidget: React.FC = () => {
    const { state } = useContext(AppContext);

    return (
        <IonItem className="profile-widget" lines="none">
            <IonThumbnail className="profile-widget_photo">
                <IonImg src={getImageUrl(state.user.photo)} />
            </IonThumbnail>
            <IonList className="profile-widget_info">
                {state.user.username && <IonItem lines="none">
                    <IonText className="profile-widget_info--username">{state.user.username}</IonText>
                </IonItem>}
                <IonItem lines="none">
                    <IonText className="profile-widget_info--bold">{state.user.role}</IonText>
                </IonItem>
                <IonItem lines="none">
                    <IonText className="profile-widget_info--bold">{state.user.stadium.name}</IonText>
                </IonItem>
                <IonItem lines="none">
                    <IonText color="gold">Gold</IonText>
                </IonItem>
                {state.user.phone && <IonItem lines="none">
                    <IonText>+{state.user.phone}</IonText>
                </IonItem>}
            </IonList>
        </IonItem>
    );
};

export default ProfileWidget;
