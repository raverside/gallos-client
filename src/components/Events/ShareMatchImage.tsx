import React, {useState} from "react";

import {getImageUrl, formatOzToLbsOz, getStadiumInitials, getBettingPreference} from '../utils';

import './ShareEventImage.css';
import logo from "../../img/logo_club.png";
import medal from "../../img/medal_big.png";
import {useTranslation} from "react-multi-lang";
import moment from "moment";

const ShareMatchImage = React.forwardRef<any, any>( ({event, match, close}, ref) => {
    const t = useTranslation();
    const amount = getBettingPreference(event, match.participant, match.opponent);
    return (<div className="share-versus-wrapper" ref={ref}>
        <div className="share-versus-header">
            <div className="share-versus-header_text">{t('baloteo.fight')} <span>#{match.number}</span></div>
            <div className="share-versus-logo">
                <img src={logo} className="logo" />
            </div>
            <div className="share-versus-header_text">{amount && t('events.amount')} {amount && <span>{amount}</span>}</div>
        </div>
        <div className="share-versus">
            <div style={{position:"relative"}}>
                <img className={((match.participant?.image_flipped) ? "share-match-image flipped" : "share-match-image") + (match.result === 1 ? " loser" : "")} src={getImageUrl(match.participant?.image)} />
                {match.result === 0 && <div className="share-versus_blue-side-won"><span><img src={medal}/>{t('judge.winner')}</span> {match.match_time > 0 && t('events.time') + " " + moment.utc(match.match_time*1000).format('mm:ss') + " " + t('events.minutes')}</div>}
            </div>
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
            <div style={{position:"relative"}}>
                <img className={((match.opponent?.image_flipped) ? "share-match-image" : "share-match-image flipped") + (match.result === 0 ? " loser" : "")} src={getImageUrl(match.opponent?.image)} />
                {match.result === 1 && <div className="share-versus_white-side-won"><span><img src={medal}/>{t('judge.winner')}</span> {match.match_time > 0 && t('events.time') + " " + moment.utc(match.match_time*1000).format('mm:ss') + " " + t('events.minutes')}</div>}
            </div>
        </div>
        <div style={{position: 'relative'}}>
            {(match.result === 2) && <div className="share-versus_draw"><span>{t('judge.draw')}</span> {match.match_time > 0 && t('events.time') + " " + moment.utc(match.match_time*1000).format('mm:ss') + " " + t('events.minutes')}</div>}
            {(match.result === 3) && <div className="share-versus_null">{t('judge.cancelled')}</div>}
            <div className="share-versus-names">
                <div className="share-versus-names_blue">{match.participant?.team?.name}</div>
                <div className="share-versus-names_vs">VS</div>
                <div className="share-versus-names_white">{match.opponent?.team?.name}</div>
            </div>
        </div>
        <div className="share-versus-event_data">
            <div style={{whiteSpace: "nowrap"}}>{t('stadiums.stadium')} <span>{event.stadium_name}</span></div>
            <div>{t('events.date')} <span>{moment(event.event_date).format("MMM D, YYYY")}</span></div>
        </div>
        <div className="shareable-image-versus_footer">GallosCLUB.com</div>
    </div>);
});

export default ShareMatchImage;
