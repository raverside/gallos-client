import {IonText, IonImg, IonList, IonItem, IonAvatar, IonLabel} from '@ionic/react';
import {getImageUrl} from '../utils';

import './UsersList.css';
import {useTranslation} from "react-multi-lang";

type UsersListProps = {
    users: Array<{}>;
};

const UsersList: React.FC<UsersListProps> = ({users}) => {
    const t = useTranslation();

    return (<IonList className="eventsList">
        {users.map((user:any, index:number) => {
            return <IonItem key={user.id} lines="none" className="user" button routerLink={"/user/"+user.id}>
                    <p className="user-index">{index + 1}</p>
                    <IonAvatar>
                        <IonImg src={getImageUrl(user.photo)} />
                    </IonAvatar>
                    <IonLabel className="user-short-info">
                        <p className="user-short-info_username">{user.username} {user.blocked && "("+t('users.blocked')+")"}</p>
                        {(user.role && user.role !== "user") ? <IonText>{t('users.role_'+user.role)}</IonText> : <IonText className="user-short-info_membership" color="gold">Gold</IonText>}
                    </IonLabel>
                </IonItem>
        })}
    </IonList>);
};

export default UsersList;
