import {
    IonContent,
    IonPage,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonHeader,
    IonTitle,
    useIonActionSheet,
    IonModal,
    IonLoading, IonRefresherContent, IonRefresher,
} from '@ionic/react';
import TeamOwnerNotesTab from '../components/TeamOwners/TeamOwnerNotesTab';
import TeamOwnerLibertyTab from '../components/TeamOwners/TeamOwnerLibertyTab';
import React, {useContext, useEffect, useState} from "react";
import {
    getTeamOwner,
    addTeamOwnerNote,
    updateTeamOwnerNote,
    removeTeamOwnerNote,
    addTeamOwnerTeam,
    addTeamOwnerLiberty,
    updateTeamOwnerLiberty,
    removeTeamOwnerLiberty,
    getTeamOwners
} from "../api/TeamOwners";
import {useParams} from 'react-router-dom';

import './TeamOwner.css';
import TeamOwnersList from "../components/TeamOwners/TeamOwnersList";
import ShareTeamOwner from "../components/TeamOwners/ShareTeamOwner";
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
// @ts-ignore
import domtoimage from "dom-to-image-improved";
import TeamOwnerEditor from "../components/TeamOwners/TeamOwnerEditor";
import {AppContext} from "../State";
import {useTranslation} from "react-multi-lang";
import {isDesktop} from "../components/utils";

type teamOwnerType = {
    id: string;
    digital_id: number;
    name: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    created_at: string;
    teams: [{name: string, digital_id:number}];
    notes: [{id: string, title:string, note:string, created_at:string}];
};

const TeamOwner: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const { id } = useParams<{id:string}>();
    const [teamOwner, setTeamOwner] = useState<any>();
    const [teamOwners, setTeamOwners] = useState<teamOwnerType>();
    const [tabSelected, setTabSelected] = useState<string>("list");
    const [showShare, setShowShare] = useState<boolean>(false);
    const [showTeamOwnerEditorModal, setShowTeamOwnerEditorModal] = useState<boolean>(false);
    const [present, dismiss] = useIonActionSheet();
    const [showLoading, setShowLoading] = useState<any>(false);
    const shareRef = React.useRef();

    useEffect(() => {
        fetchTeamOwners();
        fetchTeamOwner();
    }, []);

    const fetchTeamOwners = async () => {
        const response = await getTeamOwners();
        if (response?.team_owners?.account) {
            setTeamOwners(response.team_owners.account);
        }
    }

    const fetchTeamOwner = async (callback = () => {}) => {
        const response = (id) ? await getTeamOwner(id) : false;
        if (response.team_owner) {
            setTeamOwner(response.team_owner);
            callback();
        }
    }

    const addTeams = async (payload:{}) => {
        const response = await addTeamOwnerTeam(id, payload);
        if (response.success) {
            fetchTeamOwner();
        }
    }

    const addNote = async (noteTitle:string, note:string) => {
        const response = await addTeamOwnerNote(id, noteTitle, note);
        if (response.team_owner) {
            setTeamOwner(response.team_owner);
        } else {
            fetchTeamOwner();
        }
    }

    const updateNote = async (note_id: string, noteTitle:string, note:string) => {
        const response = await updateTeamOwnerNote(note_id, noteTitle, note);
        if (response.team_owner || response.success) {
            fetchTeamOwner();
        }
    }

    const removeNote = async (id:string) => {
        const response = await removeTeamOwnerNote(id);
        if (response.team_owner || response.success) {
            fetchTeamOwner();
        }
    }

    const addLiberty = async (libertyReason:string, selectedTeamOwner:string) => {
        const response = await addTeamOwnerLiberty(id, libertyReason, selectedTeamOwner);
        if (response.team_owner) {
            setTeamOwner(response.team_owner);
        } else {
            fetchTeamOwner();
        }
    }

    const updateLiberty = async (liberty_id: string, libertyReason:string, selectedTeamOwner:string) => {
        const response = await updateTeamOwnerLiberty(liberty_id, libertyReason, selectedTeamOwner);
        if (response.team_owner || response.success) {
            fetchTeamOwner();
        }
    }

    const removeLiberty = async (id:string) => {
        const response = await removeTeamOwnerLiberty(id);
        if (response.team_owner || response.success) {
            fetchTeamOwner();
        }
    }

    const shareOwner = async () => {
        if (!teamOwner) return false;
        const element = shareRef.current;
        setShowShare(true);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: "image/png" });
            setShowShare(false);

            if (isDesktop()) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                //share the file
                const filesArray:any = [file];
                if (navigator.canShare && navigator.canShare({files: filesArray})) {
                    navigator.share({files: filesArray});
                }
            }
            setShowLoading(false);
        });


    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="arrow-header">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/team_owners"/>
                    </IonButtons>
                    <IonTitle className="page-title offset-title">{t('teams.team_owner')}</IonTitle>
                    <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} onClick={() => present({
                        buttons: [
                            { text: t('teams.edit'), handler: () => setShowTeamOwnerEditorModal(true) },
                            { text: t('teams.share'), handler: () => shareOwner() },
                            { text: t('teams.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                        ],
                        header: t('teams.settings')
                    })} /></IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="user-profile">
                    <div className="user-profile-info">
                        {teamOwner?.name && <IonText className="user-profile-info_username">{teamOwner.name}</IonText>}
                        {teamOwner?.digital_id && <IonText className="digital-id">ID {(""+teamOwner.digital_id).substr(0, 3)+"-"+(""+teamOwner.digital_id).substr(3, 3)}</IonText>}
                        {teamOwner?.teams && <IonText>{teamOwner.teams.length} {t('teams.teams')}</IonText>}
                        {teamOwner?.phone && <IonText>+{teamOwner.phone}</IonText>}
                        {(teamOwner?.country) && <IonText>{teamOwner.city && teamOwner.city + ","} {teamOwner.country}</IonText>}
                    </div>
                </div>

                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="list"><IonLabel>{t('teams.team_list')}</IonLabel></IonSegmentButton>
                    {(state.user.role !== "worker") && <IonSegmentButton value="liberty"><IonLabel>{t('teams.mutual_liberty')}</IonLabel></IonSegmentButton>}
                    <IonSegmentButton value="notes"><IonLabel>{t('teams.notes')}</IonLabel></IonSegmentButton>
                </IonSegment>

                {tabSelected === "list" && <TeamOwnersList teamOwners={teamOwner?.teams} isTeam showTeamActions addTeams={addTeams} fetchTeamOwner={fetchTeamOwner} />}
                {tabSelected === "liberty" && <TeamOwnerLibertyTab team_owner={teamOwner!} teamOwners={teamOwners} addLiberty={addLiberty} updateLiberty={updateLiberty} removeLiberty={removeLiberty}/>}
                {tabSelected === "notes" && <TeamOwnerNotesTab team_owner={teamOwner!} addNote={addNote} updateNote={updateNote} removeNote={removeNote}/>}

                <div style={showShare ? {opacity: 1, transform: "translateX(100%)"} : {opacity: 0}}><ShareTeamOwner teamOwner={teamOwner} ref={shareRef}/></div>
                <IonModal isOpen={showTeamOwnerEditorModal} onDidDismiss={() => setShowTeamOwnerEditorModal(false)}>
                    <TeamOwnerEditor addTeamOwner={() => {fetchTeamOwners(); fetchTeamOwner();}} close={() => setShowTeamOwnerEditorModal(false)} teamOwner={teamOwner || false} />
                </IonModal>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchTeamOwner(e.detail.complete)}><IonRefresherContent /></IonRefresher>
            </IonContent>
        </IonPage>
    );
};

export default TeamOwner;
