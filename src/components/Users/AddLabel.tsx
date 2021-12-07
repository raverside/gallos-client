import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonLabel,
    IonModal,
    IonText,
    IonToolbar,
    IonInput,
    IonTitle, useIonActionSheet
} from '@ionic/react';
import {closeOutline as closeIcon, ellipsisHorizontal as menuIcon} from 'ionicons/icons';
import {upsertUserLabel, deleteUserLabel} from '../../api/Users';
import './AddLabel.css';
import {useTranslation} from "react-multi-lang";

type addLabelProps = {
    allLabels: any[];
    userLabels: string;
    refreshLabels: () => void;
    onSubmit: (labels:any) => void;
};

const AddLabel: React.FC<addLabelProps> = ({allLabels, userLabels, onSubmit, refreshLabels}) => {
    const t = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<any>(false);
    const [labels, setLabels] = useState<any>([]);
    const [newLabel, setNewLabel] = useState<any>([]);
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        if (userLabels) {
            setLabels(userLabels?.split(','));
        } else {
            setLabels([]);
        }
    }, [userLabels]);

    const hideAddModal = async () => {
        setShowModal(false);
    }

    const showEditModal = async (label:any) => {
        setNewLabel(label.label);
        setEditModal(label);
    }

    const hideEditModal = async () => {
        setNewLabel("");
        setEditModal(false);
    }

    const Submit = async () => {
        onSubmit(labels!);
        setShowModal(false);
    }

    const attachLabel = (label:any) => {
        setLabels((currentLabels:any) => [...currentLabels, label]);
    }

    const detachLabel = (label:any) => {
        setLabels((currentLabels:any) => currentLabels?.filter((l:any) => l && l !== label));
    }

    const deleteLabel = async (label:any) => {
        const response = await deleteUserLabel(label.id);
        if (response) refreshLabels();
    }

    const UpdateLabel = async () => {
        const response = await upsertUserLabel(editModal.id || undefined, newLabel);
        if (editModal.id) {
            setLabels((currentLabels: any) => currentLabels.map((t: any, ti: number) => ti === editModal.id ? newLabel : t));
        }
        if (response) refreshLabels();
        hideEditModal();
    }

    return (
        <div className="user-profile-labels">
            <IonLabel>{t('users.user_labels')}</IonLabel>
            <IonButton fill="clear" onClick={() => setShowModal(true)}>{t('users.add')}</IonButton>
            <IonModal isOpen={!!showModal} onDidDismiss={() => hideAddModal()} cssClass="add-note-modal">
                <IonToolbar className="modal-header">
                    <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideAddModal()} /></IonButtons>
                    <IonTitle className="page-title">{t('users.add_labels')}</IonTitle>
                </IonToolbar>
                <IonContent>
                    <div className="add-note-wrapper">
                        <div>
                            <IonText className="add-note-title">{t('users.labels')}</IonText>
                            {allLabels.map((label, index) => (<div className="team-input_wrapper" key={index}>
                                <IonInput key={index} className={(label.label && labels.includes(label.label)) ? "add-note-input active" : "add-note-input"} readonly placeholder={t('users.labels')} value={label.label} onClick={() => labels.includes(label.label) ? detachLabel(label.label) : attachLabel(label.label)} />
                                <IonIcon className="view-note-menu tag_menu" icon={menuIcon} slot="end" onClick={() => present({
                                    buttons: [
                                        { text: t('users.label_edit'), handler: () => showEditModal(label) },
                                        { text: t('users.label_delete'), handler: () => deleteLabel(label) },
                                        { text: t('users.label_cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                    ],
                                    header: t('users.label_settings')
                                })} />
                            </div>))}
                            <IonButton fill="outline" className="add-team-input-button" onClick={() => setEditModal(true)}>{t('users.add_new_label')}</IonButton>
                        </div>
                        <IonButton expand="block" className="split-button" onClick={Submit}><div><p>{t('users.labels')}: {labels.length}</p><p>{t('users.label_save')}</p></div></IonButton>
                        <IonModal isOpen={!!editModal} onDidDismiss={() => hideEditModal()} cssClass="add-note-modal">
                            <IonToolbar className="modal-header">
                                <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideEditModal()} /></IonButtons>
                                <IonTitle className="page-title"><p>{(typeof editModal !== "boolean" && editModal.id) ? t('users.edit') : t('users.add')} {t('users.label')}</p></IonTitle>
                            </IonToolbar>
                            <IonContent>
                                <div className="add-note-wrapper">
                                    <div>
                                        <IonText className="add-note-title">{t('users.label')}</IonText>
                                        <IonInput className="add-note-input" placeholder={t('users.label')} value={newLabel} onIonChange={(e) => setNewLabel(e.detail.value!)} />
                                    </div>
                                    <IonButton disabled={!newLabel} expand="block" onClick={UpdateLabel}>{t('users.label_save')}</IonButton>
                                </div>
                            </IonContent>
                        </IonModal>
                    </div>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default AddLabel;
