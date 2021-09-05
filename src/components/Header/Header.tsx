import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonButton, IonIcon} from '@ionic/react';
import Notifications from './Notifications';
import {addOutline as addIcon} from 'ionicons/icons';
import './Header.css';

type HeaderProps = {
    title: string;
    isRed?: boolean;
    notifications?: boolean;
    addButton?: () => void;
}

const Header: React.FC<HeaderProps> = ({title, isRed = false, notifications = true, addButton}) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton className="hamburger"/>
                </IonButtons>
                <IonTitle className="page-title" color={isRed ? "primary" : ""}>{title}</IonTitle>
                {notifications && <Notifications/>}
                {addButton && <IonButtons slot="end">
                    <IonButton slot="icon-only" className="add-icon" onClick={addButton}><IonIcon src={addIcon} size="large"/></IonButton>
                </IonButtons>}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
