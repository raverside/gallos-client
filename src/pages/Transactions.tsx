import {
    IonContent, IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from '@ionic/react';
import Header from '../components/Header/Header';
import MembershipsList from '../components/Memberships/MembershipsList';
import React, {useEffect, useState} from "react";
import {getMemberships} from "../api/Memberships";

import './Memberships.css';


const Transactions: React.FC = () => {
    const [memberships, setMemberships] = useState<Array<{id:string; type:string}>>([]);
    const [tabSelected, setTabSelected] = useState<string>("user");

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
            <Header title="Transactions" isRed={false} notifications={false}/>

            <IonContent fullscreen>

            </IonContent>
        </IonPage>
    );
};

export default Transactions;
