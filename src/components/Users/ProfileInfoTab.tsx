import {IonButton, IonLabel, IonText, IonImg, useIonToast} from '@ionic/react';
import UpdateProfile from './UpdateProfile';
import UserMembership from './UserMembership';

import copyIcon from '../../img/copy.png';
import './ProfileTabs.css';
import {useTranslation} from "react-multi-lang";

type ProfileTabProps = {
    user: {
        id: string;
        phone: string;
        username: string;
        passcode: string;
    };
    updateUser: () => void;
};

const ProfileInfoTab: React.FC<ProfileTabProps> = ({user, updateUser}) => {
    const t = useTranslation();
    const [presentToast] = useIonToast();

    const clipboard = (text:string) => {
        navigator.clipboard.writeText(text);
        presentToast(t('general.copied_clipboard'), 1000);
    }

    return (
        <div className="user-profile-info-tab">
            <div className="user-profile-section">
                <IonLabel>{t('users.login_information')}</IonLabel>
                {user && <UpdateProfile user={user} updateUser={updateUser} />}
            </div>
            <div className="user-profile-section-content">
                <div>
                    <IonLabel>{t('users.phone')}</IonLabel>
                    <IonText>+{user?.phone}</IonText>
                </div>
                <IonImg src={copyIcon} onClick={() => clipboard(user.phone!)}/>
            </div>
            <div className="user-profile-section-content">
                <div>
                    <IonLabel>{t('users.passcode')}</IonLabel>
                    <IonText>*** *** ***</IonText>
                </div>
                <IonImg src={copyIcon} onClick={() => clipboard(user.passcode!)}/>
            </div>

            <div className="user-profile-section">
                <IonLabel>{t('membership.membership')}</IonLabel>
                {user && <UserMembership user={user} />}
            </div>
            <div className="user-profile-section-content">
                <div>
                    <IonText className="user-profile-membership" color="gold">Gold</IonText>
                    <IonText className="user-profile-membership_expiration">Ends on 03/09/2022</IonText>
                </div>
            </div>

            <div className="user-profile-section">
                <IonLabel>{t('users.total_transactions')}</IonLabel>
                <IonButton fill="clear" disabled>{t('users.see_all')}</IonButton>
            </div>
            <div className="user-profile-section-content user-profile-total_transactions">0</div>
        </div>
    );
};

export default ProfileInfoTab;
