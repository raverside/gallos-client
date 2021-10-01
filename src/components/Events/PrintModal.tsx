import React, { useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon, IonInput,
    IonItem,
    IonItemDivider, IonList,
    IonModal,
    IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {
    closeOutline as closeIcon,
    printOutline as printIcon
} from 'ionicons/icons';
import './PrintModal.css';


const PrintModal: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [printOption, setPrintOption] = useState<number>();
    const [printCopies, setPrintCopies] = useState<number>();

    return (<>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} id="print-modal">
            <IonToolbar className="modal-header">
                <IonTitle className="page-title">Print</IonTitle>
                <IonButtons slot="end">
                    <IonIcon
                        icon={closeIcon}
                        className="notifications-close-icon"
                        slot="end"
                        onClick={() => setShowModal(false)}
                    />
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <IonList>
                    <IonItemDivider>Print Option</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect value={printOption} placeholder="Select print option" interface="action-sheet" onIonChange={(e) => setPrintOption(e.detail.value!)}>
                            <IonSelectOption value={0}>Live Matches</IonSelectOption>
                            <IonSelectOption value={1}>Available Matches</IonSelectOption>
                            <IonSelectOption value={2}>Unmatched Animals</IonSelectOption>
                            <IonSelectOption value={3}>Excluded Animals</IonSelectOption>
                            <IonSelectOption value={4}>All Animals non-live matches</IonSelectOption>
                            <IonSelectOption value={5}>All page</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItemDivider>Number of Copies</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput value={printCopies} type="number" min="1" max="9999999" placeholder="Number of Copies" onIonChange={(e) => setPrintCopies(+e.detail.value!)} />
                    </IonItem>
                </IonList>
                <IonButton expand="block" className="final-print-button" disabled={true} onClick={() => {}}>Print</IonButton>
            </IonContent>
        </IonModal>
        <IonIcon
            icon={printIcon}
            className="print-icon"
            slot="end"
            onClick={() => setShowModal(true)}
        />
    </>);
};

export default PrintModal;
