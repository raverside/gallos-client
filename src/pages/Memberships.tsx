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


const Memberships: React.FC = () => {
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
            <Header title="Memberships" isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="memberships-tabs-segment">
                    <IonSegmentButton value="user"><IonLabel>User Memberships</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="stadium"><IonLabel>Stadium Memberships</IonLabel></IonSegmentButton>
                </IonSegment>
                <MembershipsList memberships={memberships.filter(m => m.type === tabSelected)}/>
            </IonContent>
        </IonPage>
    );
};

export default Memberships;
