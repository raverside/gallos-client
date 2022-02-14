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

import './TeamOwnerTabs.css';
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

type TeamOwnerNotesTabProps = {
    note: noteType|false;
    team_owner: {name: string};
    onClose: () => void;
    onEdit: (note:noteType) => void;
    onRemoveNote: (id:string) => void;
};

const TeamOwnerNotesTab: React.FC<TeamOwnerNotesTabProps> = ({note, team_owner, onClose, onEdit, onRemoveNote}) => {
    const t = useTranslation();
    const [present, dismiss] = useIonActionSheet();
    const [showDeleteModal, setShowDeleteModal] = useState<string|false>(false);

    return (<>
        <IonModal isOpen={!!note} onDidDismiss={() => onClose()} cssClass="view-note-modal">
            <IonToolbar className="modal-header">
                <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => onClose()} /></IonButtons>
                <IonTitle className="page-title"><p>{t('teams.note')}</p><p className="page-subtitle">{team_owner?.name}</p></IonTitle>
                <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                    buttons: [
                        { text: t('teams.note_edit'), handler: () => { if (note) onEdit(note); onClose(); } },
                        { text: t('teams.note_delete'), handler: () => {onClose(); setShowDeleteModal(note ? note.id : false)} },
                        { text: t('teams.note_cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                    ],
                    header: t('teams.note_settings')
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
            title={t('teams.note_delete_confirm_title')}
            subtitle={t('teams.note_delete_confirm_subtitle')}
            onResult={(data, isConfirmed) => {isConfirmed && onRemoveNote(data); setShowDeleteModal(false)}}
        />
    </>);
};

export default TeamOwnerNotesTab;
