import {
    IonContent,
    IonPage,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel,
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import TeamOwnerNotesTab from '../components/TeamOwners/TeamOwnerNotesTab';
import React, {useEffect, useState} from "react";
import {getTeamOwner, addTeamOwnerNote, updateTeamOwnerNote, removeTeamOwnerNote, addTeamOwnerTeam} from "../api/TeamOwners";
import {useParams} from 'react-router-dom';
import { Country }  from 'country-state-city';

import './UserProfile.css';
import TeamOwnersList from "../components/TeamOwners/TeamOwnersList";

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
    const { id } = useParams<{id:string}>();
    const [teamOwner, setTeamOwner] = useState<teamOwnerType>();
    const [tabSelected, setTabSelected] = useState<string>("list");

    useEffect(() => {
        fetchTeamOwner()
    }, []);

    const fetchTeamOwner = async () => {
        const response = (id) ? await getTeamOwner(id) : false;
        if (response.team_owner) {
            setTeamOwner(response.team_owner);
        }
    }

    const addTeams = async (payload:{}) => {
        const response = await addTeamOwnerTeam(id, payload);
        if (response.success) {
            fetchTeamOwner();
        }
    }

    // const updateTeam = async (team_id: string, title:string) => {
    //     const response = await updateTeamOwnerTeam(team_id, title);
    //     if (response.success) {
    //         fetchTeamOwner();
    //     }
    // }
    //
    // const removeTeam = async (id:string) => {
    //     const response = await removeTeamOwnerTeam(id);
    //     if (response.success) {
    //         fetchTeamOwner();
    //     }
    // }

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
        if (response.success) {
            fetchTeamOwner();
        }
    }

    const removeNote = async (id:string) => {
        const response = await removeTeamOwnerNote(id);
        if (response.success) {
            fetchTeamOwner();
        }
    }

    const country = teamOwner?.country ? Country.getCountryByCode(teamOwner.country)?.name : "";

    return (
        <IonPage>
            <ArrowHeader title="Team Owner" backHref="/team_owners" />

            <IonContent fullscreen>
                <div className="user-profile">
                    <div className="user-profile-info">
                        {teamOwner?.name && <IonText className="user-profile-info_username">{teamOwner.name}</IonText>}
                        {teamOwner?.digital_id && <IonText>ID {teamOwner.digital_id}</IonText>}
                        {teamOwner?.teams && <IonText>{teamOwner.teams.length} Teams</IonText>}
                        {teamOwner?.phone && <IonText>+{teamOwner.phone}</IonText>}
                        {(teamOwner?.country) && <IonText>{teamOwner.city && teamOwner.city + ","} {country}</IonText>}
                    </div>
                </div>

                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="list"><IonLabel>Team List</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="liberty" disabled><IonLabel>Mutual Liberty</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="notes"><IonLabel>Notes</IonLabel></IonSegmentButton>
                </IonSegment>

                {tabSelected === "list" && <TeamOwnersList teamOwners={teamOwner?.teams} isTeam addTeams={addTeams} />}
                {tabSelected === "notes" && <TeamOwnerNotesTab team_owner={teamOwner!} addNote={addNote} updateNote={updateNote} removeNote={removeNote}/>}

            </IonContent>
        </IonPage>
    );
};

export default TeamOwner;
