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
import {useTranslation} from "react-multi-lang";

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
    const t = useTranslation();
    const [present, dismiss] = useIonActionSheet();
    const [showDeleteModal, setShowDeleteModal] = useState<string|false>(false);

    return (<>
        <IonModal isOpen={!!note} onDidDismiss={() => onClose()} cssClass="view-note-modal">
            <IonToolbar className="modal-header">
                <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => onClose()} /></IonButtons>
                <IonTitle className="page-title"><p>{t('users.note')}</p><p className="page-subtitle">{user.username}</p></IonTitle>
                <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                    buttons: [
                        { text: t('users.note_edit'), handler: () => { if (note) onEdit(note); onClose(); } },
                        { text: t('users.note_delete'), handler: () => {onClose(); setShowDeleteModal(note ? note.id : false)} },
                        { text: t('users.note_cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                    ],
                    header: t('users.note_settings')
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
            title={t('users.note_delete_confirm_title')}
            subtitle={t('users.note_delete_confirm_subtitle')}
            onResult={(data, isConfirmed) => {isConfirmed && onRemoveNote(data); setShowDeleteModal(false)}}
        />
    </>);
};

export default ProfileNotesTab;
