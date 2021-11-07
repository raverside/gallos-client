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
    const [labels, setLabels] = useState<any>([]);
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        if (userLabels) {
            setLabels(userLabels?.split(','));
        }
    }, [userLabels]);

    const hideAddModal = async () => {
        setShowModal(false);
    }

    const Submit = async () => {
        onSubmit(labels!);
        setShowModal(false);
    }

    const addLabel = (label:any) => {
        // setLabels(labels)
        // setLabels((currentLabels:any) => currentLabels.split(',').filter((l:any) =>  l && l !== label));
    }

    const deleteLabel = (label:any) => {
        // setLabels((currentLabels:any) => currentLabels?.split(',').filter((l:any) =>  l && l !== label));
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
                            {allLabels.map((label, index) => (<div className="team-input_wrapper" key={index}>
                                <IonInput key={index} className={(label && labels.includes(label)) ? "add-note-input active" : "add-note-input"} placeholder="Label" value={label} onIonChange={(e) => setLabels(labels.map((t:any, ti:number) => ti === index ? e.detail.value! : t))} />
                                <IonIcon className="view-note-menu tag_menu" icon={menuIcon} slot="end" onClick={() => present({
                                    buttons: [
                                        { text: labels.includes(label) ? 'Delete Label' : 'Add Label', handler: () => label.includes(label ? deleteLabel(label) : addLabel(label)) },
                                        { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                    ],
                                    header: 'Settings'
                                })} />
                            </div>))}
                            {labels.filter((al:any) => !allLabels.includes(al)).map((label:any, index:number) => (<div className="team-input_wrapper" key={index}>
                                <IonInput key={index} className="add-note-input active" placeholder="Label" value={label} onIonChange={(e) => setLabels(labels.map((t:any, ti:number) => ti === index ? e.detail.value! : t))} />
                                <IonIcon className="view-note-menu tag_menu" icon={menuIcon} slot="end" onClick={() => present({
                                    buttons: [
                                        { text: 'Delete Label', handler: () => deleteLabel(label) },
                                        { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                    ],
                                    header: 'Settings'
                                })} />
                            </div>))}
                            <IonButton fill="outline" className="add-team-input-button" onClick={() => setLabels([...labels, ""])}>Add New Label</IonButton>
                        </div>
                        <IonButton disabled={labels.length <= 0} expand="block" className="split-button" onClick={Submit}><div><p>Labels: {labels.length}</p><p>Save</p></div></IonButton>
                    </div>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default AddLabel;
