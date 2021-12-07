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
import {useTranslation} from "react-multi-lang";

type TeamOwnersListProps = {
    teamOwners?: Array<{name?: string; digital_id:number}>;
    isTeam?: boolean;
    addTeams?: (payload:{}) => void;
};

const TeamOwnersList: React.FC<TeamOwnersListProps> = ({teamOwners, isTeam = false, addTeams}) => {
    const t = useTranslation();
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [teams, setTeams] = useState<string[]>([""]);
    const [search, setSearch] = useState<string>("");

    const hideAddModal = async () => {
        setTeams([""]);
        setShowAddModal(false);
    }

    const Submit = async () => {
        addTeams && addTeams(teams.filter(t => t));
        hideAddModal();
    }

    return (<IonList className="teamOwnersList user-profile-notes-tab">
        <IonSearchbar className="searchbar" placeholder={isTeam ? t('teams.search_owners') : t('teams.search_teams')} value={search} onIonChange={e => {setSearch(e.detail.value!);}} />
        {addTeams && <div className="user-profile-section">
            <IonButton fill="clear" onClick={() => setShowAddModal(true)}>{t('teams.add')}</IonButton>
            <IonModal isOpen={!!showAddModal} onDidDismiss={() => hideAddModal()} cssClass="add-note-modal">
                <IonToolbar className="modal-header">
                    <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideAddModal()} /></IonButtons>
                    <IonTitle className="page-title">{t('teams.add_team')}</IonTitle>
                </IonToolbar>
                <IonContent>
                    <div className="add-note-wrapper">
                        <div>
                            <IonText className="add-note-title">{t('teams.team_name')}</IonText>
                            {teams.map((team, index) => (<div className="team-input-wrapper" key={index}>
                                <IonText className="team-index">{index + 1}</IonText>
                                <IonInput key={index} className="add-note-input" placeholder={t('teams.team_name')} value={team} onIonChange={(e) => setTeams(teams.map((t, ti) => ti === index ? e.detail.value! : t))} />
                            </div>))}
                            <IonButton fill="outline" className="add-team-input-button" onClick={() => setTeams([...teams, ""])}>{t('teams.add_another_team')}</IonButton>
                        </div>
                        <IonButton disabled={teams.length <= 0} expand="block" className="split-button" onClick={Submit}><div><p>{t('teams.teams')}: {teams.length}</p><p>{t('teams.submit')}</p></div></IonButton>
                    </div>
                </IonContent>
            </IonModal>
        </div>}
        {teamOwners?.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.digital_id == +search ).map((teamOwner:any, index:number) => {
            return <IonItem key={teamOwner.id} lines="none" className="teamOwner" button={!isTeam} routerLink={!isTeam ? "/team_owner/"+teamOwner.id : "/team_owner/"+teamOwner.team_owner_id}>
                <p className="teamOwner-index">{index + 1}</p>
                <IonLabel className="teamOwner-short-info">
                    <IonText className="teamOwner-short-info_name" color={teamOwner.name.toLowerCase().replace(/\s+/g, '')}>{teamOwner.name}</IonText>
                    {isTeam ?
                        <>
                            <IonText className="teamOwner-short-info_winrate">ID {teamOwner.digital_id}</IonText>
                            <IonText className="teamOwner-short-info_winrate">{Math.max(0, teamOwner.wins)} {t('teams.wins')} • {Math.max(0, teamOwner.draws)} {t('teams.draws')} • {Math.max(0, teamOwner.loses)} {t('teams.loses')} • {Math.min(100, Math.max(0, Math.round(teamOwner.wins / Math.max(1, (teamOwner.wins || 0) + (teamOwner.draws || 0) + (teamOwner.loses || 0)) * 100)))}%</IonText>
                        </> :
                        <IonText className="teamOwner-short-info_winrate">{teamOwner.teams?.length || 0} {t('teams.teams')}</IonText>
                    }
                </IonLabel>
            </IonItem>
        })}
    </IonList>);
};

export default TeamOwnersList;
