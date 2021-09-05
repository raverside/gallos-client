import {
    IonButtons,
    IonContent,
    IonIcon,
    IonModal,
    IonText, IonTitle,
    IonToolbar,
    useIonActionSheet
} from '@ionic/react';
import moment from "moment";

import './ProfileTabs.css';
import {closeOutline as closeIcon} from "ionicons/icons";
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
import ConfirmPrompt from "../ConfirmPrompt";
import React, {useState} from "react";

type noteType = {
    id: string;
    title: string;
    note: string;
    created_at: string;
    creator?: {username:string}
};

type ProfileNotesTabProps = {
    note: noteType|false;
    user: {username: string};
    onClose: () => void;
    onEdit: (note:noteType) => void;
    onRemoveNote: (id:string) => void;
};

const ProfileNotesTab: React.FC<ProfileNotesTabProps> = ({note, user, onClose, onEdit, onRemoveNote}) => {
    const [present, dismiss] = useIonActionSheet();
    const [showDeleteModal, setShowDeleteModal] = useState<string|false>(false);

    return (<>
        <IonModal isOpen={!!note} onDidDismiss={() => onClose()} cssClass="view-note-modal">
            <IonToolbar className="modal-header">
                <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => onClose()} /></IonButtons>
                <IonTitle className="page-title"><p>Note</p><p className="page-subtitle">{user.username}</p></IonTitle>
                <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                    buttons: [
                        { text: 'Edit Note', handler: () => { if (note) onEdit(note); onClose(); } },
                        { text: 'Delete Note', handler: () => {onClose(); setShowDeleteModal(note ? note.id : false)} },
                        { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                    ],
                    header: 'Settings'
                })} /></IonButtons>
            </IonToolbar>
            {note && <IonContent>
                <div className="note-view-wrapper">
                    <IonText className="note-info_title">{note.title}</IonText>
                    <IonText className="note-info_creator">{note.creator?.username}</IonText>
                    <IonText className="note-info_date">{moment(note.created_at).format("DD/MM/YYYY")}</IonText>
                    <IonText className="note-info_note">{note.note}</IonText>
                </div>
            </IonContent>}
        </IonModal>
        <ConfirmPrompt
            data={showDeleteModal}
            show={!!showDeleteModal}
            title="Delete Note"
            subtitle="Are you sure you want to delete this note?"
            onResult={(data, isConfirmed) => {isConfirmed && onRemoveNote(data); setShowDeleteModal(false)}}
        />
    </>);
};

export default ProfileNotesTab;
