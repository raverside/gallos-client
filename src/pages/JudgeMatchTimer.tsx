import React, {useEffect, useState, useRef, useContext} from "react";
import {getEvent, announceMatchResult} from "../api/Events";
import {
    IonContent,
    IonPage,
    IonText,
    IonLoading, IonGrid, IonRow, IonCol, IonImg, IonButton,
} from '@ionic/react';

import './Judge.css';
import startTimeIcon from "../img/icon_judge_start.svg";
import timerTimeIcon from "../img/icon_judge_timer.svg";
import resultTimeIcon from "../img/icon_judge_results.svg";
import backIcon from "../img/icon_judge_back.svg";
import yesIcon from "../img/icon_judge_yes.svg";
import noIcon from "../img/icon_judge_no.svg";
import timerConfigurationIcon from "../img/icon_judge_configurations.svg";
import timerRestartIcon from "../img/icon_judge_restart.svg";

// @ts-ignore
import alarmSound from "../sfx/alarm.mp3";
// @ts-ignore
import longAlarmSound from "../sfx/alarm_long.mp3";

import {useHistory, useParams} from "react-router-dom";
import moment from "moment";
import {AppContext} from "../State";
import {useTranslation} from "react-multi-lang";

const JudgeMatch: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
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
    const [fiveTimer, setFiveTimer] = useState<number>(5);
    const [fiveTimerInterval, setFiveTimerInterval] = useState<number>();
    const [selectResult, setSelectResult] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<number>(0);
    const [confirmRestart, setConfirmRestart] = useState<boolean>(false);
    const configRef = useRef(configuration);
    configRef.current = configuration;
    const timerRef = useRef(timer);
    timerRef.current = timer;
    const fiveTimerRef = useRef(fiveTimer);
    fiveTimerRef.current = fiveTimer;
    const sixtyIntervalRef = useRef(timerInterval);
    sixtyIntervalRef.current = timerInterval;
    const [result, setResult] = useState<number>(); // 0 - blue wins, 1 - white wins, 2 - draw, 3 - cancelled
    const alarmRef = useRef(null);
    const longAlarmRef = useRef(null);
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
        if (typeof result !== "undefined" && result >= 0 && match) await announceMatchResult(match.id, result, matchTime);
        state.socket?.emit('updateEvents', {eventId: event_id});
        window.location.replace("/judge");
    }

    const startFiveSeconds = () => {
        if (fiveTimerInterval) {
            clearInterval(fiveTimerInterval);
            setFiveTimerInterval(undefined);
            setFiveTimer(5);
        } else {
            const interval = window.setInterval(() => {
                if (configRef.current !== 2) {
                    setFiveTimer((currentFiveTimer) => {
                        if (currentFiveTimer === 1) {
                            if (matchTimeReverse > 0) {
                                setTimer(60);
                                clearInterval(interval);
                                setFiveTimerInterval(undefined);
                                setFiveTimer(5);
                            } else {
                                stopTime();
                            }
                        }
                        return Math.max(currentFiveTimer - 1, 0);
                    });
                }
            }, 1000);
            setFiveTimerInterval((currentFiveTimerInterval) => {
                clearInterval(currentFiveTimerInterval);
                return interval
            });
        }
    }

    const sixtyStop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(undefined);

            setTimer(60);
        } else if (matchTimeReverse > 0) {
            sixtyStart();
        }
    }

    const sixtyLoop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(undefined);
            setTimer(60);
        }
        if (matchTimeReverse > 0) {
            sixtyStart();
        }
    }

    const sixtyStart = () => {
        const interval = window.setInterval(() => {
            if (configRef.current !== 2) {
                setTimer((currentTimer) => {
                    if (currentTimer === 1) {
                        soundLongAlarm();
                        if (sixtyIntervalRef.current) clearInterval(sixtyIntervalRef.current);
                        stopTime();
                    }
                    return Math.max(currentTimer - 1, 0);
                });
            }
        }, 1000);
        setTimerInterval((currentTimerInterval) => {
            clearInterval(currentTimerInterval);
            return interval
        });
    }

    const startTime = (reset = true) => {
        if (reset) resetTime();
        const interval = window.setInterval(() => {
            if (configRef.current !== 2) {
                setMatchTime((currentMatchTime) => {
                    if (currentMatchTime === 59) soundAlarm();
                    const maxAllowed = 600 + (timerRef.current <= 59 ? 59 : 0);
                    if (currentMatchTime >= maxAllowed && !fiveTimerInterval) {
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
        setMatchTimeInterval((currentMatchTimeInterval) => {
            if (currentMatchTimeInterval) clearInterval(currentMatchTimeInterval);
            return undefined;
        });
        setTimerInterval((currentTimerInterval) => {
            if (currentTimerInterval) clearInterval(currentTimerInterval);
            return undefined;
        });
        setFiveTimerInterval((currentFiveTimerInterval) => {
            clearInterval(currentFiveTimerInterval);
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
        setFiveTimerInterval((currentFiveTimerInterval) => {
            clearInterval(currentFiveTimerInterval);
            return undefined;
        });
        setFiveTimer(5);
    }

    const restartMatch = () => {
        if (confirmRestart) {
            setConfirmRestart(false);
            setConfiguration(0);
            resetTime();
        } else {
            setConfirmRestart(true);
        }
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
        if (alarmRef.current){
            // @ts-ignore
            alarmRef.current.play();
        }
    }

    const soundLongAlarm = () => {
        if (longAlarmRef.current){
            // @ts-ignore
            longAlarmRef.current.play();
        }
    }

    let resultText = t('judge.select_result');
    switch (result) {
        case 0:
            resultText = t('judge.blue_wins');
            break;
        case 1:
            resultText = t('judge.white_wins');
            break;
        case 2:
            resultText = t('judge.draw');
            break;
        case 3:
            resultText = t('judge.cancelled');
            break;
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="judge-content">
                    <audio ref={alarmRef} src={alarmSound} preload="auto" />
                    <audio ref={longAlarmRef} src={longAlarmSound} preload="auto" />
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
                    {fiveTimerInterval && <div className="five_sec_timer">{fiveTimer}s</div>}
                    {showAlarm ? <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" className="judge-time-button green-time-button" onClick={() => {clearAlarm(); setShowAlarm(false);}}>
                            <IonImg src={backIcon} />
                            <IonText>Back</IonText>
                        </IonButton>
                        <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setAlarmTimer((currentAlarmTimer) => Math.max(currentAlarmTimer - 30, 0))}><IonText>{t('judge.timer_minus_thirty')}</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setAlarmTimer((currentAlarmTimer) => currentAlarmTimer + 30)}><IonText>{t('judge.timer_plus_thirty')}</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => clearAlarm()}><IonText>{t('judge.timer_clear')}</IonText></IonButton>
                        <IonButton fill="clear" className="judge-time-button blue-time-button" onClick={() => startAlarm()}><IonText>{t('judge.timer_start')}</IonText></IonButton>
                    </div> : selectResult ? <div className="judge-match-timer-buttons">
                        {(typeof result !== "undefined" && result >= 0) ? <div>
                            <div className="judge-match-timer-result">{resultText}</div>
                            <div className="judge-match-timer-confirm">
                                <IonButton fill="clear" className="judge-time-button green-time-button" onClick={() => onAnnounceMatch()}>
                                    <IonImg src={yesIcon} />
                                    <IonText>{t('judge.confirm_yes')}</IonText>
                                </IonButton>
                                <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => setResult(undefined)}>
                                    <IonImg src={noIcon} />
                                    <IonText>{t('judge.confirm_no')}</IonText>
                                </IonButton>
                            </div>
                        </div> : <div>
                            <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => setSelectResult(false)}>
                                <IonImg src={backIcon} />
                                <IonText>Back</IonText>
                            </IonButton>
                            <IonButton fill="clear" className="judge-time-button blue-time-button" onClick={() => setResult(0)}><IonText>{t('judge.blue')}</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button white-time-button" onClick={() => setResult(1)}><IonText>{t('judge.white')}</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button yellow-time-button" onClick={() => setResult(2)}><IonText>{t('judge.draw')}</IonText></IonButton>
                            <IonButton fill="clear" className="judge-time-button purple-time-button" onClick={() => setResult(3)}><IonText>{t('judge.null')}</IonText></IonButton>
                        </div>}
                    </div> : (configuration === 2 || ((matchTimeReverse === 0 || timer === 0) && !matchTimeInterval)) ? <div className="judge-match-timer-config"><div className="judge-match-timer-result">{confirmRestart ? t('judge.restart')+"?" : t('judge.configuration')}</div><div className="judge-match-timer-buttons">
                        {!confirmRestart ? <>
                            <IonButton fill="clear" onClick={() => restartMatch()} color="success" className="judge-time-button green-time-button">
                                <IonImg src={timerRestartIcon} />
                                <IonText>{t('judge.restart')}</IonText>
                            </IonButton>
                            <IonButton fill="clear" onClick={() => setSelectResult(true)} color="success" className="judge-time-button yellow-time-button">
                                <IonImg src={resultTimeIcon} />
                                <IonText>{t('judge.results')}</IonText>
                            </IonButton>
                        </> : <div className="judge-match-restart-confirm">
                            <IonButton fill="clear" className="judge-time-button green-time-button" onClick={() => restartMatch()}>
                                <IonImg src={yesIcon} />
                                <IonText>{t('judge.confirm_yes')}</IonText>
                            </IonButton>
                            <IonButton fill="clear" className="judge-time-button red-time-button" onClick={() => setConfirmRestart(false)}>
                                <IonImg src={noIcon} />
                                <IonText>{t('judge.confirm_no')}</IonText>
                            </IonButton>
                        </div>}
                    </div></div> : (matchTimeInterval) ? <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" color="success" className="judge-time-button green-time-button" onClick={showConfiguration}>
                            <IonImg src={timerConfigurationIcon} />
                            <IonText>{configuration === 1 ? t('judge.confirm')+"?" : t('judge.config')}</IonText>
                        </IonButton>
                        {event.stadium_five_sec && <IonButton fill="clear" color="tertiary" disabled={!timerInterval || timer <= 5} className="judge-time-button blue-time-button" onClick={() => startFiveSeconds()}>
                            <IonText>{t('judge.five_seconds')}</IonText>
                        </IonButton>}
                        <IonButton fill="clear" color="success" className="judge-time-button red-time-button" onClick={() => sixtyStop()}>
                            <IonText>{t('judge.sixty_stop')}</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="success" className="judge-time-button orange-time-button" onClick={() => sixtyLoop()}>
                            <IonText>{t('judge.sixty_loop')}</IonText>
                        </IonButton>
                    </div> : <div className="judge-match-timer-buttons">
                        <IonButton fill="clear" color="danger" className="judge-time-button red-time-button" onClick={() => history.replace("/judge")}>
                            <IonImg src={backIcon} />
                            <IonText>{t('judge.back')}</IonText>
                        </IonButton>
                        <IonButton fill="clear" color="success" disabled={!!matchTimeInterval} className="judge-time-button green-time-button" onClick={() => startTime()}>
                            <IonImg src={startTimeIcon} />
                            <IonText>{t('judge.start')}</IonText>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setShowAlarm(true)} className="judge-time-button purple-time-button">
                            <IonImg src={timerTimeIcon} />
                            <IonText>{t('judge.alarm')}</IonText>
                        </IonButton>
                        <IonButton fill="clear" disabled={!!matchTimeInterval} onClick={() => setSelectResult(true)} color="success" className="judge-time-button yellow-time-button">
                            <IonImg src={resultTimeIcon} />
                            <IonText>{t('judge.restart')}</IonText>
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
