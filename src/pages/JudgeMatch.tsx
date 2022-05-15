import React, {useEffect, useState} from "react";
import {getEvent, cancelMatch, swapSides} from "../api/Events";
import {
    IonContent,
    IonPage,
    IonText,
    IonLoading, IonBackButton, IonGrid, IonRow, IonCol, IonImg, IonButton,
} from '@ionic/react';
import ProfileModal from '../components/Judge/ProfileModal';

import './Judge.css';
import swapIcon from "../img/swap.png";
import {getImageUrl, formatOzToLbsOz} from "../components/utils";
import {useHistory, useLocation, useParams} from "react-router-dom";
import ConfirmPrompt from "../components/ConfirmPrompt";
import {useTranslation} from "react-multi-lang";

const JudgeMatch: React.FC = () => {
    const t = useTranslation();
    const { event_id, match_id } = useParams<{event_id:string, match_id:string}>();
    const [event, setEvent] = useState<any>();
    const [match, setMatch] = useState<any>();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<string|false>(false);
    const [showSwitchSide, setShowSwitchSide] = useState<any>(false);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        fetchMatch();
    }, []);

    const fetchMatch = async () => {
        setShowLoading(true);
        const response = {event: (location.state as any)?.event} || await getEvent(event_id);
        if (response.event) {
            setEvent(response.event);
            const currentMatch = response.event.matches.find((m:any) => m.id === match_id);
            setMatch(currentMatch);
            setShowLoading(false);
        } else {
            history.replace("/judge");
            setShowLoading(false);
        }
    }

    const onCancelMatch = async (matchId:string) => {
        await cancelMatch(matchId);
        window.location.replace("/judge");
    }

    const startSwitchSide = () => {
        setShowSwitchSide({old_participant: match?.participant, old_opponent: match?.opponent});
    }

    const switchSides = () => {
        setMatch({
            ...match,
            opponent: match.participant,
            participant: match.opponent
        });
    }

    const saveSwitchSide = () => {
        if (showSwitchSide.old_participant.id !== match.participant.id || showSwitchSide.old_opponent.id !== match.opponent.id) {
            swapSides(match.id);
            setEvent((currentEvent:any) => {
                const updatedMatches = currentEvent.matches.map((m:any) => {
                    if (m.id === match.id) {
                        const oldOpponent = {...m.opponent};
                        const oldParticipant = {...m.participant};
                        return {...m, opponent: oldParticipant, participant: oldOpponent}
                    }
                    return m;
                });

                return {...currentEvent, matches: updatedMatches};
            });
        }
        setShowSwitchSide(false);
    }

    const cancelSwitchSide = () => {
        if (showSwitchSide.old_participant && showSwitchSide.old_opponent) {
            setMatch({
                ...match,
                participant: showSwitchSide.old_participant,
                opponent: showSwitchSide.old_opponent
            });
        }
        setShowSwitchSide(false);
    }

    const openMatch = async () => {
        history.push({pathname: "/match/" + event.id + "/" + match.id, state: {event}});
    }

    const title = (event?.is_special && event?.title) ? event?.title! : t('events.default_event_name');

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="judge-header">
                    <IonBackButton defaultHref="/judge" className="judge-back-button"/>
                    <IonText>{title}</IonText>
                    <ProfileModal />
                </div>
                <div className="judge-content">
                    <IonGrid className="judge-match-view">
                        <IonRow>
                            <IonCol size="5" className="judge-match-view-blue_side">
                                {match?.participant?.image && <IonImg className={match?.participant?.image_flipped ? "judge-match-view-image flipped" : "judge-match-view-image"} src={getImageUrl(match?.participant?.image)} />}
                                {match?.result === 0 && <span className="green_chevron"/>}
                                {match?.participant.team.name}
                            </IonCol>
                            <IonCol size="2">
                                {(match?.result !== null && match?.result >= 0) ?
                                    <div className="judge-match-view-versus">
                                        <p>{t('baloteo.fight')} {match?.number || 1}</p>
                                        {match?.result === 2 && t('judge.draw')}
                                        {match?.result === 3 && t('judge.cancelled')}
                                        <div><IonButton expand="block" className="judge-match-view-null" onClick={() => openMatch()}>{t('judge.restart')}</IonButton></div>
                                    </div>
                                    :
                                    <div className="judge-match-view-versus">
                                        {!showSwitchSide ? <>
                                            <p>{t('baloteo.fight')} {match?.number || 1}</p>
                                            <div>
                                                <IonButton expand="block" className="judge-match-view-open" onClick={() => openMatch()}>{t('judge.open')}</IonButton>
                                                <IonButton expand="block" className="judge-match-view-switch_side" onClick={() => startSwitchSide()}>{t('judge.switch_side')}</IonButton>
                                                <IonButton expand="block" className="judge-match-view-null" onClick={() => setShowCancelModal(match.id)}>{t('judge.null')}</IonButton>
                                            </div>
                                        </> : <>
                                            <div>
                                                <p>{t('judge.switch_side')}</p>
                                                <IonButton fill="clear" className="judge-match-view-swap-button" onClick={() => switchSides()}><IonImg src={swapIcon} /></IonButton>
                                                <IonButton expand="block" className="judge-match-view-open" onClick={() => saveSwitchSide()}>{t('judge.save')}</IonButton>
                                                <IonButton expand="block" className="judge-match-view-null" onClick={() => cancelSwitchSide()}>{t('judge.cancel')}</IonButton>
                                            </div>
                                        </>}
                                    </div>
                                }
                            </IonCol>
                            <IonCol size="5" className="judge-match-view-white_side">
                                {match?.opponent.team.name}
                                {match?.opponent?.image && <IonImg className={match?.opponent?.image_flipped ? "judge-match-view-image" : "judge-match-view-image flipped"} src={getImageUrl(match?.opponent?.image)} />}
                                {match?.result === 1 && <span className="green_chevron"/>}
                            </IonCol>
                        </IonRow>
                        <IonRow className="judge-match-view-info">
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.type}</div>
                                <div className="judge-match-view-type_label">{t('events.type')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.type}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.weight ? formatOzToLbsOz(match.participant.weight) : ""}</div>
                                <div className="judge-match-view-type_label">{t('events.weight')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.weight ? formatOzToLbsOz(match.opponent.weight) : ""}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.color}</div>
                                <div className="judge-match-view-type_label">{t('events.color')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.color}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.alas}</div>
                                <div className="judge-match-view-type_label">{t('events.alas')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.alas}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.cresta}</div>
                                <div className="judge-match-view-type_label">{t('events.cresta')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.cresta}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.pata}</div>
                                <div className="judge-match-view-type_label">{t('events.patas')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.pata}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.physical_advantage?.replace('_', ' ')}</div>
                                <div className="judge-match-view-type_label">{t('events.advantage')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.physical_advantage.replace('_', ' ')}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.participated_before ? "Yes" : "No"}</div>
                                <div className="judge-match-view-type_label">{t('events.participated')}?</div>
                                <div className="judge-match-view-type">{match?.opponent?.participated_before ? "Yes" : "No"}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.breeder_name}</div>
                                <div className="judge-match-view-type_label">{t('events.breeder')}</div>
                                <div className="judge-match-view-type">{match?.opponent?.breeder_name}</div>
                            </div>
                        </IonRow>
                    </IonGrid>
                </div>
                <ConfirmPrompt
                    data={showCancelModal}
                    show={!!showCancelModal}
                    title={t('judge.cancel_confirm')}
                    onResult={(data, isConfirmed) => {isConfirmed && onCancelMatch(data); setShowCancelModal(false)}}
                />
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
            </IonContent>
        </IonPage>
    );
};

export default JudgeMatch;
