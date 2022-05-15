import React, {useState} from "react";

import {formatOzToLbsOz, getImageUrl, getParticipantBettingAmount, getStadiumInitials} from '../utils';

import './CompareMatch.css';
import {useTranslation} from "react-multi-lang";
import {IonButtons, IonContent, IonIcon, IonImg, IonTitle, IonToolbar} from "@ionic/react";
import {closeOutline as closeIcon} from "ionicons/icons";
import MatchGallery from "./MatchGallery";


const ShareParticipantImage: React.FC<any> = ({match, event, close}) => {
    const t = useTranslation();
    const [showGallery, setShowGallery] = useState<any>(false);

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
            <IonTitle className="page-title compare-match">{t('baloteo.fight')} {match.number || 1}</IonTitle>
        </IonToolbar>
        <IonContent>
            <div className="compare-match-wrapper">
                <div className="compare-fixed">
                    <div className="compare-images">
                        <IonImg src={(getImageUrl(match.participant?.image))} className={(match.participant?.image_flipped) ? "flipped" : ""} onClick={() => setShowGallery({match, active: 'participant'})}/>
                        <IonImg src={(getImageUrl(match.opponent?.image))} className={(match.opponent?.image_flipped) ? "" : "flipped"} onClick={() => setShowGallery({match, active: 'opponent'})}/>
                    </div>
                    <div className="compare-names">
                        <div className={match.color_confirmed ? "compare-name blue-side" : "compare-name colorlessName"}>{match.participant?.team?.name}</div>
                        <div className="compare-versus">VS</div>
                        <div className={match.color_confirmed ? "compare-name white-side" : "compare-name colorlessName"}>{match.opponent?.team?.name}</div>
                    </div>
                </div>

                <div className="compare-info">

                    {match.color_confirmed && <div className="compare-info_row">
                        <div className="compare-type">{t('judge.blue')}</div>
                        <div className="compare-type_label">{t('judge.side_color')}</div>
                        <div className="compare-type">{t('judge.white')}</div>
                    </div>}
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.type}</div>
                        <div className="compare-type_label">{t('events.type')}</div>
                        <div className="compare-type">{match.opponent?.type}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.weight ? formatOzToLbsOz(match.participant.weight) : ""}</div>
                        <div className="compare-type_label">{t('events.weight')}</div>
                        <div className="compare-type">{match.opponent?.weight ? formatOzToLbsOz(match.opponent.weight) : ""}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type green">{getParticipantBettingAmount(match.participant, event)}</div>
                        <div className="compare-type_label">{t('events.bet')}</div>
                        <div className="compare-type green">{getParticipantBettingAmount(match.opponent, event)}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.color}</div>
                        <div className="compare-type_label">{t('events.color')}</div>
                        <div className="compare-type">{match.opponent?.color}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.alas || "-"}</div>
                        <div className="compare-type_label">{t('events.alas')}</div>
                        <div className="compare-type">{match.opponent?.alas || "-"}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.cresta}</div>
                        <div className="compare-type_label">{t('events.cresta')}</div>
                        <div className="compare-type">{match.opponent?.cresta}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.pata}</div>
                        <div className="compare-type_label">{t('events.patas')}</div>
                        <div className="compare-type">{match.opponent?.pata}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                        <div className="compare-type_label">{t('events.advantage')}</div>
                        <div className="compare-type">{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.participated_before ? "Yes" : "No"}</div>
                        <div className="compare-type_label">{t('events.participated')}?</div>
                        <div className="compare-type">{match.opponent?.participated_before ? "Yes" : "No"}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.breeder_id} {match.participant?.breeder_name}</div>
                        <div className="compare-type_label">{t('events.breeder')}</div>
                        <div className="compare-type">{match.opponent?.breeder_id} {match.opponent?.breeder_name}</div>
                    </div>
                    <div className="compare-info_row">
                        <div className="compare-type">{match.participant?.stadium_id} {getStadiumInitials(match.participant?.stadium_name)}</div>
                        <div className="compare-type_label">{t('events.stadium_id')}</div>
                        <div className="compare-type">{match.opponent?.stadium_id} {getStadiumInitials(match.opponent?.stadium_name)}</div>
                    </div>
                </div>
            </div>
            {showGallery && <MatchGallery
                match={showGallery?.match}
                active={showGallery?.active}
                showModal={showGallery}
                setShowModal={setShowGallery}
            />}
        </IonContent>
    </>);
};

export default ShareParticipantImage;
