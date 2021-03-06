import {IonList, IonItem, IonLabel, IonText, IonIcon, IonButtons, useIonActionSheet} from '@ionic/react';

import './MembershipsList.css';
import React, {useContext} from "react";
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
import {AppContext} from "../../State";
import {useTranslation} from "react-multi-lang";

type MembershipsListProps = {
    memberships: Array<{}>;
    editMembership: (membership:any) => void;
    deleteMembership: (membershipId:string) => void;
};

const MembershipsList: React.FC<MembershipsListProps> = ({memberships, editMembership, deleteMembership}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [present, dismiss] = useIonActionSheet();

    return (<IonList className="membershipsList">
        {memberships.map((membership:any, index:number) => {
            return <IonItem key={membership.id} lines="none" className="membership">
                <p className="membership-index">{index + 1}</p>
                <IonLabel className="membership-short-info">
                    <IonText className="membership-short-info_name" color={membership.name.toLowerCase().replace(/\s+/g, '')}>{membership.name}</IonText>
                    <IonText className="membership-short-info_type">{membership.type} {t('membership.membership')}</IonText>
                    <IonText className="membership-short-info_duration">{membership.duration}</IonText>
                    <IonText className="membership-short-info_price">${membership.price}</IonText>
                </IonLabel>
                {(state.user.role === "admin_manager" || state.user.role === "admin") && <IonButtons slot="end"><IonIcon className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                    buttons: [
                        { text: t('membership.edit_membership'), handler: () => editMembership(membership) },
                        { text: t('membership.delete_membership'), handler: () => deleteMembership(membership.id) },
                        { text: t('membership.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                    ],
                    header: t('membership.settings')
                })} /></IonButtons>}
            </IonItem>
        })}
    </IonList>);
};

export default MembershipsList;
