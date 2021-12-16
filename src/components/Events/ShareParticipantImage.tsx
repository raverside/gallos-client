import React, {useState} from "react";

import {formatOzToLbsOz, getImageUrl} from '../utils';

import './ShareParticipantImage.css';
import moment from "moment";
import logo from "../../img/logo_club.png";
import {useTranslation} from "react-multi-lang";


const ShareParticipantImage = React.forwardRef<any, any>(({participant, close}, ref) => {
    const t = useTranslation();

    return (<div ref={ref}>
        <div className="share-logo">
            <img src={logo} className="logo" />
        </div>
        <div className="share-participant-wrapper">
            <div className="share-participant-info">
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.type')}</div>
                    <div className="share-participant-type">{participant?.type}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.stadium_id')}</div>
                    <div className="share-participant-type">{participant?.stadium_id} {participant?.stadium_name}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.color')}</div>
                    <div className="share-participant-type">{participant?.color}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.cresta')}</div>
                    <div className="share-participant-type">{participant?.cresta}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.alas')}</div>
                    <div className="share-participant-type">{participant?.alas}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.patas')}</div>
                    <div className="share-participant-type">{participant?.pata}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.breeder_id')}</div>
                    <div className="share-participant-type">{participant?.breeder_id} {participant?.breeder_name}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.weight')}</div>
                    <div className="share-participant-type">{formatOzToLbsOz(participant?.weight)}</div>
                </div>
                <div className="share-participant-info_row">
                    <div className="share-participant-type_label">{t('events.physical_advantage')}</div>
                    <div className="share-participant-type">{participant?.physical_advantage}</div>
                </div>
            </div>
            <div className="shareable-participant-image">
                <img src={getImageUrl(participant.image)} />
                <div className="shareable-participant-image_title">{participant.team?.name}</div>
            </div>
        </div>
    </div>);
});

export default ShareParticipantImage;
