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
import {useTranslation} from "react-multi-lang";

type PrintModalType = {
    event: any;
}

const PrintModal: React.FC<PrintModalType> = ({event}) => {
    const t = useTranslation();
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
                <IonTitle className="page-title">{t('events.print')}</IonTitle>
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
                    <IonItemDivider>Print Option{t('events.print_option')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect value={printOption} placeholder="Select print option" interface="alert" onIonChange={(e) => setPrintOption(e.detail.value!)}>
                            <IonSelectOption value={1}>{t('events.print_live_matches')}</IonSelectOption>
                            <IonSelectOption value={2}>{t('events.print_available_matches')}</IonSelectOption>
                            <IonSelectOption value={3}>{t('events.print_unmatched')}</IonSelectOption>
                            <IonSelectOption value={4}>{t('events.print_excluded')}</IonSelectOption>
                            <IonSelectOption value={5}>{t('events.print_all_animals')}</IonSelectOption>
                            <IonSelectOption value={6}>{t('events.print_all_animals_nonlive')}</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonButton expand="block" className="final-print-button" disabled={!printOption} onClick={() => print()}>{t('events.print')}</IonButton>
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
