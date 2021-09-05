import React, { useState } from 'react';
import {IonButton, IonButtons, IonContent, IonIcon, IonLabel, IonModal, IonText, IonToolbar, IonInput } from '@ionic/react';
import { closeOutline as closeIcon} from 'ionicons/icons';
import './AddLabel.css';

type addLabelProps = {
    onSubmit: (label:string) => void;
};

const AddLabel: React.FC<addLabelProps> = ({onSubmit}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>("");

    const Submit = async () => {
        onSubmit(newLabel!);
        setShowModal(false);
        setNewLabel("");
    }

    return (
        <div className="user-profile-labels">
            <IonLabel>User Labels</IonLabel>
            <IonButton fill="clear" onClick={() => setShowModal(true)}>Add</IonButton>
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="add-label-modal">
                <IonToolbar className="modal-header"><IonButtons slot="end"><IonIcon size="large" icon={closeIcon} slot="end" onClick={() => setShowModal(false)} /></IonButtons></IonToolbar>
                <IonContent>
                    <IonText className="modal-title">Add Label</IonText>
                    <IonInput className="add-label-input" placeholder="New label" value={newLabel} onIonChange={(e) => setNewLabel(e.detail.value!)} />
                    <IonButton disabled={!newLabel} expand="block" onClick={Submit}>Add</IonButton>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default AddLabel;
