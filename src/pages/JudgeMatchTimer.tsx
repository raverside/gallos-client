import React, {useEffect, useState, useRef} from "react";
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
import alarmSound from "../sfx/alarm.mp3";
// @ts-ignore
import longAlarmSound from "../sfx/alarm_long.wav";

import {useHistory, useParams} from "react-router-dom";
import moment from "moment";

const JudgeMatch: React.FC = () => {
    const { event_id, match_id } = useParams<{event_id:string, match_id:string}>();
    const [event, setEvent] = useState<any>();
    const [match, setMatch] = useState<any>();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showAlarm, setShowAlarm] = useState<boolean>(false);
    const [matchTime, setMatchTime] = useState<number>(0);
    const [matchTimeReverse, setMatchTimeReverse] = useState<number>(600);
    const [timer, setTimer] = useState<number>(60);
    const [alarmTimer, setAlarmTimer] = useState<number>(0);
    const [matchTimeInterval, setMatchTimeInterval] = useState<number>();
    const [timerInterval, setTimerInterval] = useState<number>();
    const [alarmInterval, setAlarmInterval] = useState<number>();
    const [selectResult, setSelectResult] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<number>(0);
    const configRef = useRef(configuration);
    configRef.current = configuration;
    const timerRef = useRef(timer);
    timerRef.current = timer;
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

    const sixtyStop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(undefined);
            setTimer(60);
        } else {
            let i = 59;
            const interval = window.setInterval(() => {
                if (configRef.current !== 2) {
                    setTimer(i);
                    if (i === 0) {
                        soundLongAlarm();
                        clearInterval(interval);
                        stopTime();
                    }
                    i--;
                }
            }, 1000);
            setTimerInterval(interval);
        }
    }

    const sixtyLoop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimer(59);
        }
        let i = 59;
        const interval = window.setInterval(() => {
            if (configRef.current !== 2) {
                setTimer(i);
                if (i === 0) {
                    soundLongAlarm();
                    clearInterval(interval);
                    stopTime();
                }
                i--;
            }
        }, 1000);
        setTimerInterval(interval);
    }

    const startTime = (reset = true) => {
        if (reset) resetTime();
        const interval = window.setInterval(() => {
            if (configRef.current !== 2) {
                setMatchTime((currentMatchTime) => {
                    if (currentMatchTime === 61) soundAlarm();
                    const maxAllowed = 600 + (timerRef.current <= 59 ? 59 : 0);
                    if (currentMatchTime >= maxAllowed) {
                        stopTime();
                        return currentMatchTime;
                    }
                    return currentMatchTime + 1;
                });
                setMatchTimeReverse((currentMatchTimeReverse) => {
                    if (currentMatchTimeReverse === 1) soundLongAlarm();
                    return (currentMatchTimeReverse > 0) ? currentMatchTimeReverse - 1 : 0;
                });
            }
        }, 1000);
        setMatchTimeInterval(interval);
    }

    const stopTime = () => {
        if (matchTimeInterval) clearInterval(matchTimeInterval);
        setMatchTimeInterval((currentMatchTimeInterval) => {
            if (currentMatchTimeInterval) clearInterval(currentMatchTimeInterval);
            return undefined;
        });
    }

    const resetTime = () => {
        setMatchTime(0);
        setMatchTimeReverse(600);
        setTimer(60);
        if (matchTimeInterval) clearInterval(matchTimeInterval);
        if (timerInterval) clearInterval(timerInterval);
        setMatchTimeInterval((currentMatchTimeInterval) => {
            if (currentMatchTimeInterval) clearInterval(currentMatchTimeInterval);
            return undefined;
        });
        setTimerInterval((currentTimerInterval) => {
            if (currentTimerInterval) clearInterval(currentTimerInterval);
            return undefined;
        });
    }

    const showConfiguration = () => {
        if (configuration === 1) {
            setConfiguration(2);
        } else if (configuration !== 2) {
            setConfiguration(1);
            setTimeout(() => {
                setConfiguration((currentConfiguration) => currentConfiguration !== 2 ? 0 : currentConfiguration);
            }, 3000);
        }
    }

    const clearAlarm = () => {
        setAlarmTimer(0);
        if (alarmInterval) clearInterval(alarmInterval);
        setAlarmInterval((currentAlarmInterval) => {
            if (currentAlarmInterval) clearInterval(currentAlarmInterval);
            return undefined;
        });
    }

    const startAlarm = () => {
        if (alarmInterval) clearInterval(alarmInterval);
        const interval = window.setInterval(() => {
            setAlarmTimer((currentAlarmTimer) => {
                if (currentAlarmTimer <= 0) {
                    clearAlarm();
                    soundLongAlarm();
                }
                return Math.max(currentAlarmTimer - 1, 0);
            });
        }, 1000);
        setAlarmInterval(interval);
    }

    const soundAlarm = () => {
        new Audio(alarmSound).play();
    }

    const soundLongAlarm = () => {
        new Audio(longAlarmSound).play();
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
                        {showAlarm && <div className="alarm-overhead">{moment.utc(alarmTimer*1000).format('mm:ss')}</div>}
                        <IonRow>
                            <IonCol size="5" className="judge-match-timer-clock_blue_side">{moment.utc(matchTime*1000).format('mm:ss')}</IonCol>
                            <IonCol size="2" className={timer > 99 ? "judge-match-timer-clock_versus small" : "judge-match-timer-clock_versus"}>{moment.duration(timer, 'seconds').asSeconds()}</IonCol>
                            <IonCol size="5" className="judge-match-timer-clock_white_side">{moment.utc(matchTimeReverse*1000).format('mm:ss')}</IonCol>
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
                    {showAlarm ? <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" className="judge-time-button green-time-button" onClick={() => {clearAlarm(); setShowAlarm(false);}}><IonText>Back</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setAlarmTimer((currentAlarmTimer) => Math.max(currentAlarmTimer - 30, 0))}><IonText>-30 Sec</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setAlarmTimer((currentAlarmTimer) => currentAlarmTimer + 30)}><IonText>+30 Sec</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => clearAlarm()}><IonText>Clear</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button blue-time-button" onClick={() => startAlarm()}><IonText>Start</IonText></IonButton>
                    </div> : selectResult ? <div className="judge-match-timer-buttons">
                        {(typeof result !== "undefined" && result >= 0) ? <div>
                            <div className="judge-match-timer-result">{resultText}</div>
                            <div className="judge-match-timer-confirm">
                                <IonButton fill="clear" className="judge-time-button green-time-button" onClick={() => onAnnounceMatch()}><IonText>Yes</IonText></IonButton>
                                <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => setResult(undefined)}><IonText>No</IonText></IonButton>
                            </div>
                        </div> : <div>
                            <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => setSelectResult(false)}><IonText>Back</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button blue-time-button" onClick={() => setResult(0)}><IonText>Blue</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setResult(1)}><IonText>White</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button yellow-time-button" onClick={() => setResult(2)}><IonText>Draw</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button purple-time-button" onClick={() => setResult(3)}><IonText>Null</IonText></IonButton>
                        </div>}
                    </div> : (configuration === 2) ? <div className="judge-match-timer-config"><div className="judge-match-timer-result">Configuration</div><div className="judge-match-timer-buttons">
                        <IonButton fill="clear" onClick={() => setConfiguration(0)} color="danger" className="judge-time-button red-time-button">
                            <IonText>Back</IonText>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => {setConfiguration(0);startTime()}} color="success" className="judge-time-button green-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>Restart</IonText>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setSelectResult(true)} color="success" className="judge-time-button yellow-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>Results</IonText>
                        </IonButton>
                    </div></div> : (matchTimeInterval) ? <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" color="success" className="judge-time-button green-time-button" onClick={showConfiguration}>
                            <IonImg src={timerTimeIcon} />
                            <IonText>{configuration === 1 ? "Confirm?" : "Config"}</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="success" className="judge-time-button red-time-button" onClick={() => sixtyStop()}>
                            <IonImg src={sixtyTimeIcon} />
                            <IonText>60|Stop</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="success" className="judge-time-button orange-time-button" onClick={() => sixtyLoop()}>
                            <IonImg src={sixtyTimeIcon} />
                            <IonText>60|Loop</IonText>
                        </IonButton>
                    </div> : <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" color="success" disabled={!!matchTimeInterval} className="judge-time-button green-time-button" onClick={() => startTime()}>
                            <IonImg src={startTimeIcon} />
                            <IonText>Start</IonText>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setShowAlarm(true)} className="judge-time-button purple-time-button">
                            <IonImg src={sixtyTimeIcon} />
                            <IonText>Alarm</IonText>
                        </IonButton>
                        <IonButton fill="clear" disabled={!!matchTimeInterval} onClick={() => setSelectResult(true)} color="success" className="judge-time-button yellow-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>Results</IonText>
                        </IonButton>
                    </div>}
                </div>
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
