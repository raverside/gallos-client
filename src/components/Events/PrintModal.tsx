import React, { useState, useRef } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonItem,
    IonItemDivider, IonList,
    IonModal,
    IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {
    closeOutline as closeIcon,
} from 'ionicons/icons';
import './PrintModal.css';
import { useReactToPrint } from 'react-to-print';
import PrintMatches from './PrintMatches';
import {useTranslation} from "react-multi-lang";

type PrintModalType = {
    event: any;
    showModal: boolean;
    setShowModal: (boolean:boolean) => void;
}

const PrintModal: React.FC<PrintModalType> = ({event, showModal, setShowModal}) => {
    const t = useTranslation();
    const [printOption, setPrintOption] = useState<number>();
    const printWrapperRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => printWrapperRef.current,
        copyStyles: false
    });

    const print = () => {
        setShowModal(false);
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
                    <IonItemDivider>{t('events.print_option')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect value={printOption} placeholder="Select print option" interface="alert" onIonChange={(e) => setPrintOption(e.detail.value!)}>
                            <IonSelectOption value={1}>{t('events.print_live_matches')}</IonSelectOption>
                            <IonSelectOption value={2}>{t('events.print_live_matches_cut')}</IonSelectOption>
                            <IonSelectOption value={3}>{t('events.print_available_matches')}</IonSelectOption>
                            <IonSelectOption value={4}>{t('events.print_available_matches_cut')}</IonSelectOption>
                            <IonSelectOption value={5}>{t('events.print_unmatched')}</IonSelectOption>
                            <IonSelectOption value={6}>{t('events.print_excluded')}</IonSelectOption>
                            <IonSelectOption value={7}>{t('events.print_all_animals')}</IonSelectOption>
                            <IonSelectOption value={8}>{t('events.print_all_animals_cut')}</IonSelectOption>
                            <IonSelectOption value={9}>{t('events.print_all_animals_nonlive')}</IonSelectOption>
                            <IonSelectOption value={10}>{t('events.print_all_animals_fight_order')}</IonSelectOption>
                            <IonSelectOption value={11}>{t('events.print_live_matches_color')}</IonSelectOption>
                            <IonSelectOption value={12}>{t('events.print_live_matches_colorless')}</IonSelectOption>
                            <IonSelectOption value={13}>{t('events.print_live_matches_qr_color')}</IonSelectOption>
                            <IonSelectOption value={14}>{t('events.print_live_matches_qr_colorless')}</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonButton expand="block" className="final-print-button" disabled={!(typeof printOption !== "undefined" && printOption >= 0)} onClick={() => print()}>{t('events.print')}</IonButton>
            </IonContent>
        </IonModal>


        <div style={{ overflow: "hidden", height: 0, width: 0, position: "relative" }}><PrintMatches ref={printWrapperRef} event={event} mode={printOption} /></div>
    </>);
};

export default PrintModal;
