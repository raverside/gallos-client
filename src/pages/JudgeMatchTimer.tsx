import React, {useEffect, useState} from "react";
import {getEvent, cancelMatch} from "../api/Events";
import {
    IonContent,
    IonPage,
    IonText,
    IonLoading, IonGrid, IonRow, IonCol, IonImg, IonButton,
} from '@ionic/react';

import './Judge.css';
import startTimeIcon from "../img/time_start.png";
import stopTimeIcon from "../img/time_stop.png";
import sixtyTimeIcon from "../img/time_60.png";
import timerTimeIcon from "../img/time_timer.png";
import alarmTimeIcon from "../img/time_alarm.png";
import resetTimeIcon from "../img/time_reset.png";
import resultTimeIcon from "../img/time_results.png";
import {useHistory, useParams} from "react-router-dom";
import ConfirmPrompt from "../components/ConfirmPrompt";
import moment from "moment";

const JudgeMatch: React.FC = () => {
    const { event_id, match_id } = useParams<{event_id:string, match_id:string}>();
    const [event, setEvent] = useState<any>();
    const [match, setMatch] = useState<any>();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<string|false>(false);
    const [matchTime, setMatchTime] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60);
    const [matchTimeInterval, setMatchTimeInterval] = useState<number>();
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

    const startTime = () => {
        if (matchTimeInterval) return false;
        let i = 1;
        const interval = window.setInterval(() => {
            setMatchTime(matchTime + i);
            i++;
        }, 1000);
        setMatchTimeInterval(interval);
    }

    const stopTime = () => {
        if (!matchTimeInterval) return false;
        clearInterval(matchTimeInterval);
        setMatchTimeInterval(undefined);
    }

    const resetTime = () => {
        setMatchTime(0);
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="judge-content">
                    <IonGrid className="judge-match-timer">
                        <IonRow>
                            <IonCol size="5" className="judge-match-timer-clock_blue_side">{moment.utc(matchTime*1000).format('mm:ss')}</IonCol>
                            <IonCol size="2" className={timer > 99 ? "judge-match-timer-clock_versus small" : "judge-match-timer-clock_versus"}>{moment.duration(timer, 'seconds').asSeconds()}</IonCol>
                            <IonCol size="5" className="judge-match-timer-clock_white_side">{moment.utc(matchTime*1000).format('mm:ss')}</IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="5" className="judge-match-timer-blue_side">
                                {match?.participant.team.name}
                            </IonCol>
                            <IonCol size="2" className="judge-match-timer-versus">
                                Pelea {event?.matches?.findIndex((m:any) => m.id === match_id)+1 || 1}
                            </IonCol>
                            <IonCol size="5" className="judge-match-timer-white_side">
                                {match?.opponent.team.name}
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <div className="judge-match-timer-buttons">
                        {(matchTime > 0 && !matchTimeInterval) ? <IonButton fill="clear" color="warning" className="judge-time-button orange-time-button" onClick={() => resetTime()}>
                                <IonImg src={resetTimeIcon} />
                                <IonText>Reset Time</IonText>
                            </IonButton>
                            : <IonButton fill="clear" color="success" disabled={!!matchTimeInterval} className="judge-time-button green-time-button" onClick={() => startTime()}>
                            <IonImg src={startTimeIcon} />
                            <IonText>Start Time</IonText>
                        </IonButton>}
                        <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => stopTime()}>
                            <IonImg src={stopTimeIcon} />
                            <IonText>Stop Time</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="warning" className="judge-time-button yellow-time-button">
                            <IonImg src={sixtyTimeIcon} />
                            <IonText>Start 60s</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="secondary" className="judge-time-button blue-time-button">
                            <IonImg src={timerTimeIcon} />
                            <IonText>Start Timer</IonText>
                        </IonButton>
                        <IonButton fill="clear" className="judge-time-button purple-time-button">
                            <IonImg src={alarmTimeIcon} />
                            <IonText>Alarm Sound</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="success" className="judge-time-button green-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>Result</IonText>
                        </IonButton>
                    </div>
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
