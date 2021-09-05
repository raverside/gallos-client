import {IonButton, IonLabel, IonText, IonImg, useIonToast} from '@ionic/react';
import moment from 'moment';
import UpdateProfile from './UpdateProfile';
import UserMembership from './UserMembership';

import copyIcon from '../../img/copy.png';
import './ProfileTabs.css';

type ProfileTabProps = {
    user: {
        id: string;
        phone: string;
        username: string;
    };
    updateUser: () => void;
};

const ProfileInfoTab: React.FC<ProfileTabProps> = ({user, updateUser}) => {
    const [presentToast] = useIonToast();

    const clipboard = (text:string) => {
        navigator.clipboard.writeText(text);
        presentToast('Copied to clipboard', 1000);
    }

    return (
        <div className="user-profile-info-tab">
            <div className="user-profile-section">
                <IonLabel>Log In Information</IonLabel>
                {user && <UpdateProfile user={user} updateUser={updateUser} />}
            </div>
            <div className="user-profile-section-content">
                <div>
                    <IonLabel>Phone Number</IonLabel>
                    <IonText>+{user?.phone}</IonText>
                </div>
                <IonImg src={copyIcon} onClick={() => clipboard(user.phone!)}/>
            </div>

            <div className="user-profile-section">
                <IonLabel>Membership</IonLabel>
                {user && <UserMembership user={user} />}
            </div>
            <div className="user-profile-section-content">
                <div>
                    <IonText className="user-profile-membership" color="gold">Gold</IonText>
                    <IonText className="user-profile-membership_expiration">Ends on 03/09/2022</IonText>
                </div>
            </div>

            <div className="user-profile-section">
                <IonLabel>Total Transactions</IonLabel>
                <IonButton fill="clear" disabled>See All</IonButton>
            </div>
            <div className="user-profile-section-content user-profile-total_transactions">0</div>
        </div>
    );
};

export default ProfileInfoTab;
