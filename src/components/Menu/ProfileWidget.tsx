import {IonItem, IonImg, IonText, IonList, IonThumbnail} from "@ionic/react";
import {useContext} from "react";
import {AppContext} from "../../State";

import './ProfileWidget.css';

const ProfileWidget: React.FC = () => {
    const { state } = useContext(AppContext);
    return (
        <IonItem className="profile-widget" lines="none">
            <IonThumbnail className="profile-widget_photo">
                <IonImg src="https://www.upwork.com/profile-portraits/c15CnghktJ7H8W2InGwiaFt6HSebeCI3c6HcIOjpy4uoY5FLhERK6PpTUEwKuaVzGE" />
            </IonThumbnail>
            <IonList className="profile-widget_info">
                {state.user.username && <IonItem lines="none">
                    <IonText className="profile-widget_info--username">{state.user.username}</IonText>
                </IonItem>}
                <IonItem lines="none">
                    <IonText className="profile-widget_info--bold">Event Manager</IonText>
                </IonItem>
                <IonItem lines="none">
                    <IonText className="profile-widget_info--bold">Some Stadium</IonText>
                </IonItem>
                <IonItem lines="none">
                    <IonText color="gold">Gold</IonText>
                </IonItem>
                {state.user.phone && <IonItem lines="none">
                    <IonText>{state.user.phone}</IonText>
                </IonItem>}
            </IonList>
        </IonItem>
    );
};

export default ProfileWidget;
