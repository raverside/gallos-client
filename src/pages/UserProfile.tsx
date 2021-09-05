import {
    IonContent,
    IonPage,
    IonAvatar,
    IonImg,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel, IonIcon
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import AddLabel from '../components/Users/AddLabel';
import ProfileInfoTab from '../components/Users/ProfileInfoTab';
import ProfileNotesTab from '../components/Users/ProfileNotesTab';
import ConfirmPrompt from '../components/ConfirmPrompt';
import React, {useEffect, useState} from "react";
import {getUser, updateUserLabels, addUserNote, updateUserNote, removeUserNote} from "../api/Users";
import {useParams} from 'react-router-dom';
import {getImageUrl} from '../components/utils';
import moment from 'moment';
import {closeOutline as closeIcon} from "ionicons/icons";
import { Country }  from 'country-state-city';

import './UserProfile.css';

type userType = {
    id: string;
    photo: string|null;
    username: string;
    phone: string;
    city: string;
    country: string;
    created_at: string;
    last_login: string;
    labels: string;
    notes: [{id: string, title:string, note:string, created_at:string}];
};

const UserProfile: React.FC = () => {
    const { id } = useParams<{id:string}>();
    const [user, setUser] = useState<userType>();
    const [showLabelConfirmPrompt, setShowLabelConfirmPrompt] = useState<boolean>(false);
    const [labelToDelete, setLabelToDelete] = useState<string|boolean>(false);
    const [tabSelected, setTabSelected] = useState<string>("info");

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchUser = async () => {
        const response = (id) ? await getUser(id) : false;
        if (response.user) {
            setUser(response.user);
        }
    }

    const addLabel = async (label:string) => {
        const labels = user?.labels.split(',').filter(l =>  l);
        const labelList = [...labels!, label];
        const response = await updateUserLabels(id, labelList.join(','));
        if (response.user) {
            setUser(response.user);
        } else {
            fetchUser();
        }
    }

    const removeLabel = async (label:string) => {
        const labelList = user?.labels.split(',').filter(l =>  l && l !== label) || [];
        const response = await updateUserLabels(id, labelList.join(','));
        if (response.user) {
            setUser(response.user);
        } else {
            fetchUser();
        }
    }

    const addNote = async (noteTitle:string, note:string) => {
        const response = await addUserNote(id, noteTitle, note);
        if (response.user) {
            setUser(response.user);
        } else {
            fetchUser();
        }
    }

    const updateNote = async (note_id: string, noteTitle:string, note:string) => {
        const response = await updateUserNote(note_id, noteTitle, note);
        if (response.user) {
            setUser(response.user);
        } else {
            fetchUser();
        }
    }

    const removeNote = async (id:string) => {
        const response = await removeUserNote(id);
        if (response.success) {
            fetchUser();
        }
    }

    const country = user?.country ? Country.getCountryByCode(user.country)?.name : "";

    return (
        <IonPage>
            <ArrowHeader title="Profile" backHref="/users" />

            <IonContent fullscreen>
                <div className="user-profile">
                    {user?.photo && <IonAvatar><IonImg src={getImageUrl(user.photo)} /></IonAvatar>}
                    <div className="user-profile-info">
                        {user?.username && <IonText className="user-profile-info_username">{user.username}</IonText>}
                        {user?.phone && <IonText>+{user.phone}</IonText>}
                        {(user?.country && user?.city) && <IonText>{user.city}, {country}</IonText>}
                        {user?.created_at && <IonText className="user-profile-info-smalltext">Joined {moment(user.created_at).format('DD/MM/YYYY')}</IonText>}
                        {user?.last_login && <IonText className="user-profile-info-smalltext">Last online {moment(user.last_login).fromNow()}</IonText>}
                    </div>
                </div>

                <AddLabel onSubmit={addLabel} />
                <ConfirmPrompt
                    data={labelToDelete}
                    show={showLabelConfirmPrompt}
                    title="Delete Label"
                    subtitle="Are you sure you want to delete this label?"
                    onResult={(data, isConfirmed) => {isConfirmed && removeLabel(data); setShowLabelConfirmPrompt(false)}}
                />
                <IonSegment scrollable className="user-profile-labels-segment">
                    {user?.labels.split(',').filter(l =>  l).map((label:string, index:number) => (
                        <IonSegmentButton key={index} layout="icon-end" color="primary" onClick={() => {setLabelToDelete(label); setShowLabelConfirmPrompt(true)}}>
                            <IonLabel>{label}</IonLabel>
                            <IonIcon icon={closeIcon} />
                        </IonSegmentButton>
                    ))}
                </IonSegment>

                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="info"><IonLabel>Information</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="notes"><IonLabel>Notes</IonLabel></IonSegmentButton>
                </IonSegment>

                {tabSelected === "info" && <ProfileInfoTab user={user!} updateUser={fetchUser} />}
                {tabSelected === "notes" && <ProfileNotesTab user={user!} addNote={addNote} updateNote={updateNote} removeNote={removeNote}/>}

            </IonContent>
        </IonPage>
    );
};

export default UserProfile;
