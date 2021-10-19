import React, {useEffect, useState} from "react";
import {getEvent, announceMatchResult} from "../api/Events";
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

// @ts-ignore
import alarmSound from "../sfx/rooster.wav";

import {useHistory, useParams} from "react-router-dom";
import ConfirmPrompt from "../components/ConfirmPrompt";
import moment from "moment";

const JudgeMatch: React.FC = () => {
    const { event_id, match_id } = useParams<{event_id:string, match_id:string}>();
    const [event, setEvent] = useState<any>();
    const [match, setMatch] = useState<any>();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showAnnounceModal, setShowAnnounceModal] = useState<boolean>(false);
    const [matchTime, setMatchTime] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60);
    const [matchTimeInterval, setMatchTimeInterval] = useState<number>();
    const [timerInterval, setTimerInterval] = useState<number>();
    const [selectResult, setSelectResult] = useState<boolean>(false);
    const [result, setResult] = useState<number>(); // 0 - blue wins, 1 - white wins, 2 - draw, 3 - cancelled
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

    const onAnnounceMatch = async () => {
        if (typeof result !== "undefined" && result >= 0 && match) await announceMatchResult(match.id, result);
        window.location.replace("/judge");
    }

    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        let i = 1;
        const interval = window.setInterval(() => {
            setTimer(i);
            i++;
        }, 1000);
        setTimerInterval(interval);
    }

    const startSixty = () => {
        if (timerInterval) clearInterval(timerInterval);
        let i = 60;
        const interval = window.setInterval(() => {
            setTimer(i);
            i--;
            if (i === 1) clearInterval(interval);
        }, 1000);
        setTimerInterval(interval);
    }

    const startTime = () => {
        resetTime();
        if (matchTimeInterval) return false;
        let i = 1;
        const interval = window.setInterval(() => {
            setMatchTime(matchTime + i);
            i++;
        }, 1000);
        setMatchTimeInterval(interval);
    }

    const stopTime = () => {
        if (matchTimeInterval) clearInterval(matchTimeInterval);
        if (timerInterval) clearInterval(timerInterval);
        setMatchTimeInterval(undefined);
        setTimerInterval(undefined);
    }

    const resetTime = () => {
        setMatchTime(0);
        setTimer(60);
        if (matchTimeInterval) clearInterval(matchTimeInterval);
        if (timerInterval) clearInterval(timerInterval);
        setMatchTimeInterval(undefined);
        setTimerInterval(undefined);
    }

    const soundAlarm = () => {
        new Audio(alarmSound).play();
    }

    let resultText = "Select result";
    switch (result) {
        case 0:
            resultText = "Blue Wins";
            break;
        case 1:
            resultText = "White Wins";
            break;
        case 2:
            resultText = "Draw";
            break;
        case 3:
            resultText = "Cancelled";
            break;
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
                                {result === 0 && <div className="green_chevron"/>}
                                {match?.participant.team.name}
                            </IonCol>
                            <IonCol size="2" className="judge-match-timer-versus">
                                Pelea {event?.matches?.findIndex((m:any) => m.id === match_id)+1 || 1}
                            </IonCol>
                            <IonCol size="5" className="judge-match-timer-white_side">
                                {match?.opponent.team.name}
                                {result === 1 && <div className="green_chevron"/>}
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    {selectResult ? <div className="judge-match-timer-select_result">
                        <div className={(typeof result !== "undefined" && result >= 0) ? "judge-match-timer-result active" : "judge-match-timer-result"}>{resultText}</div>
                        <div>
                            <IonButton className="judge-match-timer-result_button judge-match-timer-blue_wins" onClick={() => setResult(0)}>Blue Side Wins</IonButton>
                            <IonButton className="judge-match-timer-result_button judge-match-timer-white_wins" onClick={() => setResult(1)}>White Side Wins</IonButton>
                            <IonButton className="judge-match-timer-result_button judge-match-timer-draw" onClick={() => setResult(2)}>Draw</IonButton>
                            <IonButton className="judge-match-timer-result_button judge-match-timer-null" onClick={() => setResult(3)}>Null</IonButton>
                        </div>
                        <div>
                            <IonButton className="judge-match-timer-announce_button" disabled={!(typeof result !== "undefined" && result >= 0)} onClick={() => setShowAnnounceModal(true)}>Announce</IonButton>
                            <IonButton className="judge-match-timer-cancel_button" onClick={() => setSelectResult(false)}>Cancel</IonButton>
                        </div>
                    </div> : <div className="judge-match-timer-buttons">
                        {(matchTime > 0 && !matchTimeInterval) ? <IonButton fill="clear" color="warning" className="judge-time-button orange-time-button" onClick={() => resetTime()}>
                                <IonImg src={resetTimeIcon} />
                                <IonText>Reset Time</IonText>
                            </IonButton>
                            : <IonButton fill="clear" color="success" disabled={!!matchTimeInterval} className="judge-time-button green-time-button" onClick={() => startTime()}>
                            <IonImg src={startTimeIcon} />
                            <IonText>Start Time</IonText>
                        </IonButton>}
                        <IonButton fill="clear" disabled={!matchTimeInterval} className="judge-time-button red-time-button" onClick={() => stopTime()}>
                            <IonImg src={stopTimeIcon} />
                            <IonText>Stop Time</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="warning" onClick={() => startSixty()} disabled={!matchTimeInterval} className="judge-time-button yellow-time-button">
                            <IonImg src={sixtyTimeIcon} />
                            <IonText>Start 60s</IonText>
                        </IonButton>
                        <IonButton fill="clear" disabled={!!matchTimeInterval || !!matchTime} color="secondary" onClick={() => startTimer()} className="judge-time-button blue-time-button">
                            <IonImg src={timerTimeIcon} />
                            <IonText>Start Timer</IonText>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => soundAlarm()} className="judge-time-button purple-time-button">
                            <IonImg src={alarmTimeIcon} />
                            <IonText>Alarm Sound</IonText>
                        </IonButton>
                        <IonButton fill="clear" disabled={!!matchTimeInterval} onClick={() => setSelectResult(true)} color="success" className="judge-time-button green-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>Result</IonText>
                        </IonButton>
                    </div>}
                </div>
                <ConfirmPrompt
                    data={showAnnounceModal}
                    show={showAnnounceModal}
                    title={"Confirm match outcome: " + resultText +  "?"}
                    onResult={(data, isConfirmed) => {isConfirmed && onAnnounceMatch(); setShowAnnounceModal(false)}}
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
