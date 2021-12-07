import {
    IonContent, IonLabel, IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from '@ionic/react';
import Header from '../components/Header/Header';
import TeamOwnersList from '../components/TeamOwners/TeamOwnersList';
import TeamOwnerEditor from "../components/TeamOwners/TeamOwnerEditor";
import React, {useEffect, useState} from "react";
import {getTeamOwners} from "../api/TeamOwners";

import './TeamOwners.css';
import {useTranslation} from "react-multi-lang";


const TeamOwners: React.FC = () => {
    const t = useTranslation();
    const [teamOwners, setTeamOwners] = useState<{account: [], team: []}>();
    const [tabSelected, setTabSelected] = useState<string>("account");
    const [showTeamOwnerEditorModal, setShowTeamOwnerEditorModal] = useState<boolean>(false);

    useEffect(() => {
        fetchTeamOwners();
    }, []);

    const fetchTeamOwners = async () => {
        const response = await getTeamOwners();
        if (response.team_owners) {
            setTeamOwners(response.team_owners);
        }
    }

    const addTeamOwner = () => {
        fetchTeamOwners();
    }

    return (
        <IonPage>
            <Header title={t('teams.team_owners')} isRed={false} notifications={false} addButton={() => setShowTeamOwnerEditorModal(true)} />

            <IonContent fullscreen>
                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="team-owners-tabs-segment">
                    <IonSegmentButton value="account"><IonLabel>{t('teams.team_accounts')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="team"><IonLabel>{t('teams.list_of_teams')}</IonLabel></IonSegmentButton>
                </IonSegment>
                <TeamOwnersList teamOwners={tabSelected === "account" ? teamOwners?.account : teamOwners?.team} isTeam={tabSelected === "team"} />
                <IonModal isOpen={showTeamOwnerEditorModal} onDidDismiss={() => setShowTeamOwnerEditorModal(false)}>
                    <TeamOwnerEditor addTeamOwner={addTeamOwner} close={() => setShowTeamOwnerEditorModal(false)} />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default TeamOwners;
