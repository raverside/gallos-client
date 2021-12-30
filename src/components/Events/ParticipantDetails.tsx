import React, {useState} from "react";

import {formatOzToLbsOz, getImageUrl, getParticipantBettingAmount} from '../utils';

import './ParticipantDetails.css';
import {useTranslation} from "react-multi-lang";
import {IonButtons, IonContent, IonIcon, IonTitle, IonToolbar} from "@ionic/react";
import {closeOutline as closeIcon} from "ionicons/icons";


const ShareParticipantImage = React.forwardRef<any, any>(({participant, event, close}) => {
    const t = useTranslation();

    return (<>
        <IonToolbar className="modal-header">
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    slot="start"
                    className="close-participant-icon"
                    onClick={() => close()}
                />
            </IonButtons>
        </IonToolbar>
        <IonContent>
            <img src={getImageUrl(participant.image)} className="participant-details-image" />
            <div className="participant-details-name">{participant ? "#" + participant.cage + " " + participant.team?.name : ""}</div>
            <div className={(participant.status === "approved") ? "participant-details-status green" : "participant-details-status red"}>{t('events.'+participant.status)}</div>
            <div className="participant-details-info">
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.type')}</div>
                    <div className="participant-details-type">{participant?.type}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.stadium_id')}</div>
                    <div className="participant-details-type">{participant?.stadium_id} {participant?.stadium_name}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.color')}</div>
                    <div className="participant-details-type">{participant?.color}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.cresta')}</div>
                    <div className="participant-details-type">{participant?.cresta}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.alas')}</div>
                    <div className="participant-details-type">{participant?.alas}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.patas')}</div>
                    <div className="participant-details-type">{participant?.pata}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.breeder_id')}</div>
                    <div className="participant-details-type">{participant?.breeder_id}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.breeder_name')}</div>
                    <div className="participant-details-type">{participant?.breeder_name}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.weight')}</div>
                    <div className="participant-details-type">{formatOzToLbsOz(participant?.weight)}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.participated')}</div>
                    <div className="participant-details-type">{participant?.participated_before ? t('events.experienced_participant') : t('events.not_experienced_participant')}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.physical_advantage')}</div>
                    <div className="participant-details-type">{participant?.physical_advantage}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.bet')}</div>
                    <div className="participant-details-type">{getParticipantBettingAmount(participant, event)}</div>
                </div>
                <div className="participant-details-info_row">
                    <div className="participant-details-type_label">{t('events.betting_preference')}</div>
                    <div className="participant-details-type">{participant?.betting_pref}</div>
                </div>
            </div>
        </IonContent>
    </>);
});

export default ShareParticipantImage;
