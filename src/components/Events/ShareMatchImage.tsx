import React, {useState} from "react";

import {getImageUrl, formatOzToLbsOz, getStadiumInitials} from '../utils';

import './ShareEventImage.css';
import logo from "../../img/logo.png";
import {useTranslation} from "react-multi-lang";

const ShareMatchImage = React.forwardRef<any, any>( ({match, close}, ref) => {
    const t = useTranslation();
    return (<div className="share-versus-wrapper" ref={ref}>
        <div className="share-versus-logo">
            <img src={logo} className="logo" />
        </div>
        <div className="share-versus">
            <img className={match.participant?.image_flipped ? "share-match-image flipped" : "share-match-image"} src={getImageUrl(match.participant?.image)} />
            <div className="share-versus-info">
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.type}</div>
                    <div className="share-versus-type_label">{t('events.type')}</div>
                    <div className="share-versus-type">{match.opponent?.type}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.weight ? formatOzToLbsOz(match.participant.weight) : ""}</div>
                    <div className="share-versus-type_label">{t('events.weight')}</div>
                    <div className="share-versus-type">{match.opponent?.weight ? formatOzToLbsOz(match.opponent.weight) : ""}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.color}</div>
                    <div className="share-versus-type_label">{t('events.color')}</div>
                    <div className="share-versus-type">{match.opponent?.color}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.alas || "-"}</div>
                    <div className="share-versus-type_label">{t('events.alas')}</div>
                    <div className="share-versus-type">{match.opponent?.alas || "-"}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.cresta}</div>
                    <div className="share-versus-type_label">{t('events.cresta')}</div>
                    <div className="share-versus-type">{match.opponent?.cresta}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.pata}</div>
                    <div className="share-versus-type_label">{t('events.patas')}</div>
                    <div className="share-versus-type">{match.opponent?.pata}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                    <div className="share-versus-type_label">{t('events.advantage')}</div>
                    <div className="share-versus-type">{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.participated_before ? "Yes" : "No"}</div>
                    <div className="share-versus-type_label">{t('events.participated')}?</div>
                    <div className="share-versus-type">{match.opponent?.participated_before ? "Yes" : "No"}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.breeder_id} {match.participant?.breeder_name}</div>
                    <div className="share-versus-type_label">{t('events.breeder')}</div>
                    <div className="share-versus-type">{match.opponent?.breeder_id} {match.opponent?.breeder_name}</div>
                </div>
                <div className="share-versus-info_row">
                    <div className="share-versus-type">{match.participant?.stadium_id} {getStadiumInitials(match.participant?.stadium_name)}</div>
                    <div className="share-versus-type_label">{t('events.stadium_id')}</div>
                    <div className="share-versus-type">{match.opponent?.stadium_id} {getStadiumInitials(match.opponent?.stadium_name)}</div>
                </div>
            </div>
            <img className={match.opponent?.image_flipped ? "share-match-image" : "share-match-image flipped"} src={getImageUrl(match.opponent?.image)} />
        </div>
        <div className="shareable-image-versus_footer">GallosCLUB.com</div>
    </div>);
});

export default ShareMatchImage;
