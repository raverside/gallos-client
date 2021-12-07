import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonInput,
    IonTextarea,
    IonModal,
    IonText, IonTitle,
    IonToolbar, IonList, IonLabel, IonItem,
} from '@ionic/react';
import React, {useState} from "react";
import moment from "moment";
import ProfileNoteView from './ProfileNoteView';

import './ProfileTabs.css';
import {closeOutline as closeIcon} from "ionicons/icons";
import {useTranslation} from "react-multi-lang";

type noteType = {
    id: string;
    title: string;
    note: string;
    created_at: string;
    creator?: {username:string}
};
type ProfileTabProps = {
    user: {
        id: string;
        username: string;
        notes: [noteType];
    };
    addNote: (noteTitle:string, note:string) => void;
    updateNote: (id:string, noteTitle:string, note:string) => void;
    removeNote: (id:string) => void;
};

const ProfileNotesTab: React.FC<ProfileTabProps> = ({user, addNote, updateNote, removeNote}) => {
    const t = useTranslation();
    const [showAddModal, setShowAddModal] = useState<noteType|boolean>(false);
    const [showNoteModal, setShowNoteModal] = useState<noteType|false>(false);
    const [noteTitle, setNoteTitle] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const Submit = async () => {
        if (typeof showAddModal !== "boolean" && showAddModal.id) {
            updateNote(showAddModal.id, noteTitle, note);
        } else {
            addNote(noteTitle, note);
        }
        hideEditModal();
    }

    const showEditModal = async (note:noteType) => {
        setNoteTitle(note.title);
        setNote(note.note);
        setShowAddModal(note);
    }

    const hideEditModal = async () => {
        setNoteTitle("");
        setNote("");
        setShowAddModal(false);
    }

    return (
        <div className="user-profile-notes-tab">
            <div className="user-profile-section">
                <IonButton fill="clear" onClick={() => setShowAddModal(true)}>{t('users.note_add')}</IonButton>
            </div>
            {(user.notes?.length > 0) && <IonList>
                {user.notes.map((note, index) => (
                    <IonItem key={note.id} lines="none" className="note" button onClick={() => setShowNoteModal(note)}>
                        <p className="note-index">{index + 1}</p>
                        <IonLabel className="note-info">
                            <IonText className="note-info_title">{note.title}</IonText>
                            {note?.creator?.username && <IonText className="note-info_creator">{note.creator.username}</IonText>}
                            <IonText className="note-info_date">{moment(note.created_at).format("DD/MM/YYYY")}</IonText>
                            <IonText className="note-info_note">{note.note}</IonText>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>}
            <ProfileNoteView note={showNoteModal} user={user} onClose={() => setShowNoteModal(false)} onEdit={(note) => showEditModal(note)} onRemoveNote={(id:string) => removeNote(id)}/>
            <IonModal isOpen={!!showAddModal} onDidDismiss={() => hideEditModal()} cssClass="add-note-modal">
                <IonToolbar className="modal-header">
                    <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideEditModal()} /></IonButtons>
                    <IonTitle className="page-title"><p>{(typeof showAddModal !== "boolean" && showAddModal.id) ? t('users.note_edit') : t('users.note_add')} {t('users.note')}</p><p className="page-subtitle">{user.username}</p></IonTitle>
                </IonToolbar>
                <IonContent>
                    <div className="add-note-wrapper">
                        <div>
                            <IonText className="add-note-title">{t('users.note_title')}</IonText>
                            <IonInput className="add-note-input" placeholder={t('users.note_title')} value={noteTitle} onIonChange={(e) => setNoteTitle(e.detail.value!)} />
                            <IonText className="add-note-title">{t('users.note')}</IonText>
                            <IonTextarea className="add-note-input" placeholder={t('users.note_for')+" "+user.username} rows={5} value={note} onIonChange={(e) => setNote(e.detail.value!)} />
                        </div>
                        <IonButton disabled={!noteTitle || !note} expand="block" onClick={Submit}>{t('users.note_save')}</IonButton>
                    </div>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default ProfileNotesTab;
