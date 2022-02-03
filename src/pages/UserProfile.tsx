import {
    IonContent,
    IonPage,
    IonAvatar,
    IonImg,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonLoading,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonHeader,
    useIonActionSheet,
    IonModal
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import AddLabel from '../components/Users/AddLabel';
import ProfileInfoTab from '../components/Users/ProfileInfoTab';
import ProfileNotesTab from '../components/Users/ProfileNotesTab';
import ConfirmPrompt from '../components/ConfirmPrompt';
import React, {useContext, useEffect, useState} from "react";
import {getUser, updateUserLabels, addUserNote, updateUserNote, removeUserNote, getAllLabels, toggleUserBlock} from "../api/Users";
import {useParams} from 'react-router-dom';
import {getImageUrl} from '../components/utils';
import moment from 'moment';
import {closeOutline as closeIcon, ellipsisHorizontal as menuIcon} from "ionicons/icons";

import './UserProfile.css';
import {useTranslation} from "react-multi-lang";
import {AppContext} from "../State";
import UserEditor from "../components/Users/UserEditor";

type userType = {
    id: string;
    photo: string|null;
    username: string;
    passcode: string;
    phone: string;
    city: string;
    country: string;
    created_at: string;
    last_login: string;
    labels: string;
    blocked: boolean;
    notes: [{id: string, title:string, note:string, created_at:string}];
};

const UserProfile: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const { id } = useParams<{id:string}>();
    const [user, setUser] = useState<userType>();
    const [showLabelConfirmPrompt, setShowLabelConfirmPrompt] = useState<boolean>(false);
    const [labelToDelete, setLabelToDelete] = useState<string|boolean>(false);
    const [tabSelected, setTabSelected] = useState<string>("info");
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [allLabels, setAllLabels] = useState<any>([]);
    const [showEditUserModal, setShowEditUserModal] = useState<any>(false);
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        fetchUser();
        fetchAllLabels();
    }, []);

    const fetchUser = async () => {
        setShowLoading(true);
        const response = (id) ? await getUser(id) : false;
        if (response.user) {
            setUser(response.user);
            setShowLoading(false);
        } else {
            setShowLoading(false);
        }
    }

    const fetchAllLabels = async () => {
        const response = await getAllLabels();
        if (response.labels) {
            setAllLabels(response.labels);
        }
    }

    const addLabel = async (labels:[]) => {
        const response = await updateUserLabels(id, labels.filter((l:any) => !!l).join(','));
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

    const blockUser = async (id:string) => {
        const response = await toggleUserBlock(id);
        if (response.success) {
            fetchUser();
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="arrow-header">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/users"/>
                    </IonButtons>
                    <IonTitle className="page-title offset-title">{t('profile.header')}</IonTitle>
                    {state.user?.role === "admin" && <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} onClick={() => present({
                        buttons: [
                            { text: t('users.edit'), handler: () => setShowEditUserModal(user) },
                            { text: user?.blocked ? t('users.unblock') : t('users.block'), handler: () => user && blockUser(user.id) },
                            { text: t('users.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                        ],
                        header: t('users.settings')
                    })} /></IonButtons>}
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="user-profile">
                    {user?.photo && <IonAvatar><IonImg src={getImageUrl(user.photo)} /></IonAvatar>}
                    <div className="user-profile-info">
                        {user?.username && <IonText className="user-profile-info_username">{user.username} {user.blocked && "("+t('users.blocked')+")"}</IonText>}
                        {user?.phone && <IonText>+{user.phone}</IonText>}
                        {(user?.country && user?.city) && <IonText>{user.city}, {user.country}</IonText>}
                        {user?.created_at && <IonText className="user-profile-info-smalltext">{t('profile.joined')} {moment(user.created_at).format('DD/MM/YYYY')}</IonText>}
                        {user?.last_login && <IonText className="user-profile-info-smalltext">{t('profile.last_online')} {moment(user.last_login).fromNow()}</IonText>}
                    </div>
                </div>

                <AddLabel allLabels={allLabels} userLabels={user?.labels || ""} onSubmit={addLabel} refreshLabels={() => fetchAllLabels()}/>
                <ConfirmPrompt
                    data={labelToDelete}
                    show={showLabelConfirmPrompt}
                    title={t('profile.delete_label_title')}
                    subtitle={t('profile.delete_label_subtitle')}
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
                    <IonSegmentButton value="info"><IonLabel>{t('profile.information')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="notes"><IonLabel>{t('profile.notes')}</IonLabel></IonSegmentButton>
                </IonSegment>

                {tabSelected === "info" && <ProfileInfoTab user={user!} updateUser={fetchUser} />}
                {tabSelected === "notes" && <ProfileNotesTab user={user!} addNote={addNote} updateNote={updateNote} removeNote={removeNote}/>}
                <IonModal isOpen={!!showEditUserModal} onDidDismiss={() => setShowEditUserModal(false)} cssClass="update-profile-modal">
                    <UserEditor user={showEditUserModal} close={() => {setShowEditUserModal(false); fetchUser()}} />
                </IonModal>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
            </IonContent>
        </IonPage>
    );
};

export default UserProfile;
