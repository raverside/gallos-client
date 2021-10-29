import React, { useState, useRef } from 'react';
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
import { useReactToPrint } from 'react-to-print';
import PrintMatches from './PrintMatches';

type PrintModalType = {
    event: any;
}

const PrintModal: React.FC<PrintModalType> = ({event}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [printOption, setPrintOption] = useState<number>();
    const printWrapperRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => printWrapperRef.current,
        copyStyles: false
    });

    const print = () => {
        setShowModal(false);
        setShowPrintModal(true);
        if (handlePrint) handlePrint();
    }

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
                        <IonSelect value={printOption} placeholder="Select print option" interface="alert" onIonChange={(e) => setPrintOption(e.detail.value!)}>
                            <IonSelectOption value={1}>Live Matches</IonSelectOption>
                            <IonSelectOption value={2}>Available Matches</IonSelectOption>
                            <IonSelectOption value={3}>Unmatched Animals</IonSelectOption>
                            <IonSelectOption value={4}>Excluded Animals</IonSelectOption>
                            <IonSelectOption value={5}>All Animals</IonSelectOption>
                            <IonSelectOption value={6}>All Animals (non-live matches)</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonButton expand="block" className="final-print-button" disabled={!printOption} onClick={() => print()}>Print</IonButton>
            </IonContent>
        </IonModal>
        <IonIcon
            icon={printIcon}
            className="print-icon"
            slot="end"
            onClick={() => setShowModal(true)}
        />

        <div style={{ overflow: "hidden", height: 0, width: 0 }}><PrintMatches ref={printWrapperRef} event={event} mode={printOption} /></div>
    </>);
};

export default PrintModal;
