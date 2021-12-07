import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonTextarea,
    IonModal,
    IonText, IonTitle,
    IonToolbar, IonList, IonLabel, IonItem, IonSearchbar,
} from '@ionic/react';
import React, {useState} from "react";

import './TeamOwnerTabs.css';
import {closeOutline as closeIcon, trashOutline as trashIcon} from "ionicons/icons";
import ConfirmPrompt from "../ConfirmPrompt";
import {useTranslation} from "react-multi-lang";

type libertyType = {
    id: string;
    opponent_liberty?: {name:string, digital_id:number};
    reason?: string;
    owner_id: string;
    opponent_id: string;
    active: boolean;
};
type TeamOwnerTabProps = {
    team_owner: {
        id: string;
        name: string;
        liberty?: [libertyType];
    };
    teamOwners: any,
    addLiberty: (noteTitle:string, note:string) => void;
    updateLiberty: (id:string, noteTitle:string, note:string) => void;
    removeLiberty: (id:string) => void;
};

const TeamOwnerNotesTab: React.FC<TeamOwnerTabProps> = ({team_owner, teamOwners, addLiberty, updateLiberty, removeLiberty}) => {
    const t = useTranslation();
    const [showAddModal, setShowAddModal] = useState<libertyType|boolean>(false);
    const [showDeleteLiberty, setShowDeleteLiberty] = useState<libertyType|boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [libertyReason, setLibertyReason] = useState<string>("");
    const [selectedTeamOwners, setSelectedTeamOwners] = useState<any>([]);

    const Submit = async () => {
        if (typeof showAddModal !== "boolean" && showAddModal.id) {
            updateLiberty(showAddModal.id, libertyReason, selectedTeamOwners[0]);
        } else {
            addLiberty(libertyReason, selectedTeamOwners[0]);
        }
        hideEditModal();
    }

    const hideEditModal = async () => {
        setLibertyReason("");
        setSelectedTeamOwners([]);
        setShowAddModal(false);
    }

    const showEditLibertyModal = async (liberty:libertyType) => {
        setShowAddModal(liberty);
        setSearch("" + liberty.opponent_liberty?.digital_id || "");
        setSelectedTeamOwners([liberty.opponent_id]);
        setLibertyReason(liberty.reason || "");
    }
    return (
        <div className="user-profile-notes-tab">
            <div className="user-profile-section">
                <IonButton fill="clear" onClick={() => setShowAddModal(true)}>{t('teams.mutual_liberty_add')}</IonButton>
            </div>
            {(team_owner?.liberty && team_owner?.liberty?.length > 0) && <IonList>
                {team_owner?.liberty?.map((liberty:any, index:number) => (
                    <IonItem key={liberty.id} lines="none" className="note" button onClick={() => showEditLibertyModal(liberty)}>
                        <p className="note-index">{index + 1}</p>
                        <IonLabel className="note-info">
                            {liberty?.opponent_liberty?.name && <IonText className="note-info_title">{liberty.opponent_liberty.name}</IonText>}
                            {liberty?.reason && <IonText className="note-info_creator">{liberty.reason}</IonText>}
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>}
            <IonModal isOpen={!!showAddModal} onDidDismiss={() => hideEditModal()} cssClass="add-note-modal">
                <IonToolbar className="modal-header">
                    <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideEditModal()} /></IonButtons>
                    <IonTitle className="page-title"><p>{(typeof showAddModal !== "boolean" && showAddModal.id) ? t('teams.mutual_liberty_edit') : t('teams.mutual_liberty_add')} {t('teams.mutual_liberty')}</p><p className="page-subtitle">{team_owner.name}</p></IonTitle>
                    {(typeof showAddModal !== "boolean" && showAddModal?.id) && <IonButtons slot="end"><IonIcon className="trash-icon" icon={trashIcon} slot="end" onClick={() => setShowDeleteLiberty(showAddModal)} /></IonButtons>}
                </IonToolbar>
                <IonContent>
                    <div className="add-note-wrapper">
                        <div>
                            <IonList className="teamOwnersList user-profile-notes-tab">
                                <IonSearchbar className="searchbar" placeholder={t('teams.search_owners')} value={search} onIonChange={e => {setSearch(e.detail.value!);}} />
                                {(search || selectedTeamOwners.length > 0) && teamOwners?.filter((t:any) => t.name?.toLowerCase().includes(search.toLowerCase()) || t.digital_id == +search ).map((teamOwner:any, index:number) => {
                                    return <IonItem key={teamOwner.id} lines="none" className={selectedTeamOwners.find((sto:any) => sto === teamOwner.id) ? "teamOwner specialGuest selected" : "teamOwner specialGuest"} onClick={() =>
                                        setSelectedTeamOwners && (selectedTeamOwners.find((sto:any) => sto === teamOwner.id) ? setSelectedTeamOwners([]) : setSelectedTeamOwners([teamOwner.id]))
                                    }>
                                        <p className="teamOwner-index">{index + 1}</p>
                                        <IonLabel className="teamOwner-short-info">
                                            <IonText className="teamOwner-short-info_name" color={teamOwner.name.toLowerCase().replace(/\s+/g, '')}>{teamOwner.name}</IonText>
                                            <IonText className="teamOwner-short-info_winrate">{teamOwner.teams?.length || 0} {t('teams.teams')}</IonText>
                                        </IonLabel>
                                    </IonItem>
                                })}
                            </IonList>
                            <IonText className="add-note-title">{t('teams.mutual_liberty_reason')}</IonText>
                            <IonTextarea className="add-note-input" placeholder="" rows={5} value={libertyReason} onIonChange={(e) => setLibertyReason(e.detail.value!)} />
                        </div>
                        <IonButton disabled={!libertyReason || selectedTeamOwners.length <= 0} expand="block" onClick={Submit}>{t('teams.note_save')}</IonButton>
                    </div>
                    <ConfirmPrompt
                        data={showDeleteLiberty}
                        show={!!showDeleteLiberty}
                        title={t('teams.mutual_liberty_delete_title')}
                        subtitle={t('teams.mutual_liberty_delete_subtitle')}
                        onResult={(data, isConfirmed) => {if (isConfirmed && data?.id) { removeLiberty(data.id); hideEditModal(); } setShowDeleteLiberty(false)}}
                    />
                </IonContent>
            </IonModal>
        </div>
    );
};

export default TeamOwnerNotesTab;
