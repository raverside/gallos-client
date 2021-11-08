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
import './AddLabel.css';

type addLabelProps = {
    allLabels: any[];
    userLabels: string;
    onSubmit: (labels:any) => void;
};

const AddLabel: React.FC<addLabelProps> = ({allLabels, userLabels, onSubmit}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<any>(false);
    const [labels, setLabels] = useState<any>([]);
    const [newLabel, setNewLabel] = useState<any>([]);
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        if (userLabels) {
            setLabels(userLabels?.split(','));
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

    const addLabel = (label:any) => {
        setLabels((currentLabels:any) => [...currentLabels, label]);
    }

    const deleteLabel = (label:any) => {
        setLabels((currentLabels:any) => currentLabels?.filter((l:any) => l && l !== label));
    }

    const UpdateLabel = () => {
        if (editModal.id) {
            setLabels((currentLabels: any) => currentLabels.map((t: any, ti: number) => ti === editModal.id ? newLabel : t));
        } else {
            setLabels((currentLabels:any) => [...currentLabels, newLabel]);
        }
        hideEditModal();
    }

    return (
        <div className="user-profile-labels">
            <IonLabel>User Labels</IonLabel>
            <IonButton fill="clear" onClick={() => setShowModal(true)}>Add</IonButton>
            <IonModal isOpen={!!showModal} onDidDismiss={() => hideAddModal()} cssClass="add-note-modal">
                <IonToolbar className="modal-header">
                    <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideAddModal()} /></IonButtons>
                    <IonTitle className="page-title">Add Labels</IonTitle>
                </IonToolbar>
                <IonContent>
                    <div className="add-note-wrapper">
                        <div>
                            <IonText className="add-note-title">Labels</IonText>
                            {allLabels.filter((al:any) => !labels.includes(al)).map((label, index) => (<div className="team-input_wrapper" key={index}>
                                <IonInput key={index} className={(label && labels.includes(label)) ? "add-note-input active" : "add-note-input"} readonly placeholder="Label" value={label} onClick={() => labels.includes(label) ? deleteLabel(label) : addLabel(label)} onIonChange={(e) => setLabels((currentLabels:any) => currentLabels.map((t:any, ti:number) => ti === index ? e.detail.value! : t))} />
                                <IonIcon className="view-note-menu tag_menu" icon={menuIcon} slot="end" onClick={() => present({
                                    buttons: [
                                        { text: 'Edit Label', handler: () => showEditModal({id: index, label}) },
                                        { text: 'Delete Label', handler: () => deleteLabel(label) },
                                        { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                    ],
                                    header: 'Settings'
                                })} />
                            </div>))}
                            {labels.map((label:any, index:number) => (<div className="team-input_wrapper" key={index}>
                                <IonInput key={index} className="add-note-input active" readonly placeholder="Label" value={label} onClick={() => labels.includes(label) ? deleteLabel(label) : addLabel(label)} onIonChange={(e) => setLabels((currentLabels:any) => currentLabels.map((t:any, ti:number) => ti === index ? e.detail.value! : t))} />
                                <IonIcon className="view-note-menu tag_menu" icon={menuIcon} slot="end" onClick={() => present({
                                    buttons: [
                                        { text: 'Edit Label', handler: () => showEditModal({id: index, label}) },
                                        { text: 'Delete Label', handler: () => deleteLabel(label) },
                                        { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                    ],
                                    header: 'Settings'
                                })} />
                            </div>))}
                            <IonButton fill="outline" className="add-team-input-button" onClick={() => setEditModal(true)}>Add New Label</IonButton>
                        </div>
                        <IonButton disabled={labels.length <= 0} expand="block" className="split-button" onClick={Submit}><div><p>Labels: {labels.length}</p><p>Save</p></div></IonButton>
                        <IonModal isOpen={!!editModal} onDidDismiss={() => hideEditModal()} cssClass="add-note-modal">
                            <IonToolbar className="modal-header">
                                <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => hideEditModal()} /></IonButtons>
                                <IonTitle className="page-title"><p>{(typeof editModal !== "boolean" && editModal.id) ? "Edit" : "Add"} Label</p></IonTitle>
                            </IonToolbar>
                            <IonContent>
                                <div className="add-note-wrapper">
                                    <div>
                                        <IonText className="add-note-title">Label</IonText>
                                        <IonInput className="add-note-input" placeholder="Label" value={newLabel} onIonChange={(e) => setNewLabel(e.detail.value!)} />
                                    </div>
                                    <IonButton disabled={!newLabel} expand="block" onClick={UpdateLabel}>Post</IonButton>
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
