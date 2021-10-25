import {
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonContent, IonInput, IonModal, IonSearchbar
} from '@ionic/react';

import './TeamOwnersList.css';

import React, {useEffect, useState} from "react";
import {closeOutline as closeIcon} from "ionicons/icons";

type TeamOwnersListProps = {
    transactions: Array<any>;
};

const TransactionsList: React.FC<TeamOwnersListProps> = ({transactions}) => {
    return (<IonList className="teamOwnersList user-profile-notes-tab">
        {transactions.map((transaction:any, index:number) => {
            return <IonItem key={transaction.id} lines="none" className="teamOwner" routerLink={"/transaction/"+transaction.id}>
                <p className="teamOwner-index">{index + 1}</p>
                <IonLabel className="teamOwner-short-info">
                    <IonText className="teamOwner-short-info_name">{transaction.amount}</IonText>
                    <IonText className="teamOwner-short-info_name">{transaction.user?.name}</IonText>
                    <IonText className="teamOwner-short-info_winrate">{transaction.created_at}</IonText>
                </IonLabel>
            </IonItem>
        })}
    </IonList>);
};

export default TransactionsList;
