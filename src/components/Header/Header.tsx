import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonIcon} from '@ionic/react';
import Notifications from './Notifications';
import './Header.css';

type HeaderProps = {
    title: string;
    isRed?: boolean;
    notifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({title, isRed = false, notifications = true}) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton className="hamburger"/>
                </IonButtons>
                <IonTitle className="page-title" color={isRed ? "primary" : ""}>{title}</IonTitle>
                {notifications && <Notifications/>}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
