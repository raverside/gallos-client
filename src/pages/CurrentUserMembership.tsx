import {
    IonContent,
    IonPage,
    IonText,
    IonButton
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import React, {useEffect, useState} from "react";

import './CurrentUserMembership.css';
import {getMemberships} from "../api/Memberships";
import {useTranslation} from "react-multi-lang";


const CurrentUserMembership: React.FC = () => {
    const t = useTranslation();
    const [memberships, setMemberships] = useState<Array<{id:string; type:string}>>([]);

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        const response = await getMemberships();
        if (response.memberships) {
            setMemberships(response.memberships);
        }
    }

    return (
        <IonPage>
            <ArrowHeader title={t('membership.current_membership_header')} backHref="/" />

            <IonContent fullscreen>
                <div className="current-user-membership">
                    <IonText>{t('membership.current_membership')}</IonText>
                    <IonText className="current-membership" color="gold">Gold</IonText>
                </div>
                <div className="select-membership">
                    <IonText>{t('membership.select_membership')}</IonText>
                    {memberships.filter(m => m.type === "user").map((m:any) => <div className="pick-membership">
                        <IonText className="membership-name">{m.name}</IonText>
                        <IonText className="membership-price">${m.price} USD</IonText>
                        <IonText className="membership-duration">{m.duration}</IonText>
                    </div>)}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CurrentUserMembership;
