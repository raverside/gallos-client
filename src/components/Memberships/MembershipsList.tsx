import {IonList, IonItem, IonLabel, IonText} from '@ionic/react';

import './MembershipsList.css';
import React from "react";

type MembershipsListProps = {
    memberships: Array<{}>;
};

const MembershipsList: React.FC<MembershipsListProps> = ({memberships}) => {


    return (<IonList className="membershipsList">
        {memberships.map((membership:any, index:number) => {
            return <IonItem key={membership.id} lines="none" className="membership">
                <p className="membership-index">{index + 1}</p>
                <IonLabel className="membership-short-info">
                    <IonText className="membership-short-info_name" color={membership.name.toLowerCase().replace(/\s+/g, '')}>{membership.name}</IonText>
                    <IonText className="membership-short-info_type">{membership.type} Membership</IonText>
                    <IonText className="membership-short-info_duration">{membership.duration}</IonText>
                    <IonText className="membership-short-info_price">${membership.price}</IonText>
                </IonLabel>
            </IonItem>
        })}
    </IonList>);
};

export default MembershipsList;
