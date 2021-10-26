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
import {useHistory, useParams} from "react-router-dom";
import ConfirmPrompt from "../components/ConfirmPrompt";

const JudgeMatch: React.FC = () => {
    const { event_id, match_id } = useParams<{event_id:string, match_id:string}>();
    const [event, setEvent] = useState<any>();
    const [match, setMatch] = useState<any>();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<string|false>(false);
    const [showSwitchSide, setShowSwitchSide] = useState<any>(false);
    const history = useHistory();

    useEffect(() => {
        fetchMatch();
    }, []);

    const fetchMatch = async () => {
        setShowLoading(true);
        const response = (event_id) ? await getEvent(event_id) : false;
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
        if (showSwitchSide.old_participant.id !== match.participant.id || showSwitchSide.old_opponent.id !== match.opponent.id) swapSides(match.id);
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
        history.push("/match/" + event.id + "/" + match.id);
    }

    const title = (event?.is_special && event?.title) ? event?.title! : "Traditional Events";

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
                                {match?.participant.team.name}
                            </IonCol>
                            <IonCol size="2">
                                <div className="judge-match-view-versus">
                                    {!showSwitchSide ? <>
                                        <p>Pelea {event?.matches?.findIndex((m:any) => m.id === match_id)+1 || 1}</p>
                                        <div>
                                            <IonButton expand="block" className="judge-match-view-open" onClick={() => openMatch()}>Open</IonButton>
                                            <IonButton expand="block" className="judge-match-view-switch_side" onClick={() => startSwitchSide()}>Switch Side</IonButton>
                                            <IonButton expand="block" className="judge-match-view-null" onClick={() => setShowCancelModal(match.id)}>Null</IonButton>
                                        </div>
                                    </> : <>
                                        <div>
                                            <p>Switch Side</p>
                                            <IonButton fill="clear" className="judge-match-view-swap-button" onClick={() => switchSides()}><IonImg src={swapIcon} /></IonButton>
                                            <IonButton expand="block" className="judge-match-view-open" onClick={() => saveSwitchSide()}>Save</IonButton>
                                            <IonButton expand="block" className="judge-match-view-null" onClick={() => cancelSwitchSide()}>Cancel</IonButton>
                                        </div>
                                    </>}
                                </div>
                            </IonCol>
                            <IonCol size="5" className="judge-match-view-white_side">
                                {match?.opponent.team.name}
                                {match?.opponent?.image && <IonImg className={match?.opponent?.image_flipped ? "judge-match-view-image" : "judge-match-view-image flipped"} src={getImageUrl(match?.opponent?.image)} />}
                            </IonCol>
                        </IonRow>
                        <IonRow className="judge-match-view-info">
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.type}</div>
                                <div className="judge-match-view-type_label">Marcaje</div>
                                <div className="judge-match-view-type">{match?.opponent?.type}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.weight ? formatOzToLbsOz(match.participant.weight) : ""}</div>
                                <div className="judge-match-view-type_label">Weight</div>
                                <div className="judge-match-view-type">{match?.opponent?.weight ? formatOzToLbsOz(match.opponent.weight) : ""}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.color}</div>
                                <div className="judge-match-view-type_label">Color</div>
                                <div className="judge-match-view-type">{match?.opponent?.color}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.alas}</div>
                                <div className="judge-match-view-type_label">Alas</div>
                                <div className="judge-match-view-type">{match?.opponent?.alas}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.cresta}</div>
                                <div className="judge-match-view-type_label">Cresta</div>
                                <div className="judge-match-view-type">{match?.opponent?.cresta}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.pata}</div>
                                <div className="judge-match-view-type_label">Patas</div>
                                <div className="judge-match-view-type">{match?.opponent?.pata}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.physical_advantage?.replace('_', ' ')}</div>
                                <div className="judge-match-view-type_label">Advantage</div>
                                <div className="judge-match-view-type">{match?.opponent?.physical_advantage.replace('_', ' ')}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.participated_before ? "Yes" : "No"}</div>
                                <div className="judge-match-view-type_label">Participated?</div>
                                <div className="judge-match-view-type">{match?.opponent?.participated_before ? "Yes" : "No"}</div>
                            </div>
                            <div className="judge-match-view-info_row">
                                <div className="judge-match-view-type">{match?.participant?.breeder_name}</div>
                                <div className="judge-match-view-type_label">Breeder</div>
                                <div className="judge-match-view-type">{match?.opponent?.breeder_name}</div>
                            </div>
                        </IonRow>
                    </IonGrid>
                </div>
                <ConfirmPrompt
                    data={showCancelModal}
                    show={!!showCancelModal}
                    title="Are you sure you want to cancel this match?"
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
