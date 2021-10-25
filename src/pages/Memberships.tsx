import {
    IonContent, IonLabel, IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from '@ionic/react';
import Header from '../components/Header/Header';
import MembershipsList from '../components/Memberships/MembershipsList';
import React, {useContext, useEffect, useState} from "react";
import {getMemberships, deleteMembership} from "../api/Memberships";

import './Memberships.css';
import MembershipEditor from "../components/Memberships/MembershipEditor";
import {AppContext} from "../State";
import ConfirmPrompt from "../components/ConfirmPrompt";


const Memberships: React.FC = () => {
    const { state } = useContext(AppContext);
    const [memberships, setMemberships] = useState<Array<{id:string; type:string}>>([]);
    const [tabSelected, setTabSelected] = useState<string>("user");
    const [showMembershipEditorModal, setShowMembershipEditorModal] = useState<any>(false);
    const [showMembershipDeletePrompt, setShowMembershipDeletePrompt] = useState<any>(false);

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
            <Header title="Memberships" isRed={false} notifications={false} addButton={(state.user.role === "admin_manager" || state.user.role === "admin") ? () => setShowMembershipEditorModal(true) : undefined}/>

            <IonContent fullscreen>
                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="memberships-tabs-segment">
                    <IonSegmentButton value="user"><IonLabel>User Memberships</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="stadium"><IonLabel>Stadium Memberships</IonLabel></IonSegmentButton>
                </IonSegment>
                <MembershipsList memberships={memberships.filter(m => m.type === tabSelected)} editMembership={setShowMembershipEditorModal} deleteMembership={setShowMembershipDeletePrompt}/>
                <IonModal isOpen={!!showMembershipEditorModal} onDidDismiss={() => setShowMembershipEditorModal(false)}>
                    <MembershipEditor membership={showMembershipEditorModal} close={() => setShowMembershipEditorModal(false)} fetchMemberships={fetchMemberships}/>
                </IonModal>
                <ConfirmPrompt
                    data={showMembershipDeletePrompt}
                    show={!!showMembershipDeletePrompt}
                    title="Are you sure you want to delete this membership?"
                    onResult={(data, isConfirmed) => {isConfirmed && deleteMembership(data); setShowMembershipDeletePrompt(false); fetchMemberships();}}
                />
            </IonContent>
        </IonPage>
    );
};

export default Memberships;
