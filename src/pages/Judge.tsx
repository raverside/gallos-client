import React, {useContext, useEffect, useState} from "react";
import {getOngoingEvents} from "../api/Events";
import {
    IonContent,
    IonPage,
    IonText,
    IonSegmentButton,
    IonLabel,
    IonSegment,
    IonList,
    IonItem,
    IonGrid, IonRow, IonCol, IonImg,
    IonSelectOption, IonSelect, IonLoading,
    useIonViewWillEnter
} from '@ionic/react';
import ProfileModal from '../components/Judge/ProfileModal';

import './Judge.css';
import {getImageUrl} from "../components/utils";
import {useTranslation} from "react-multi-lang";
import moment from "moment";
import {useHistory, useParams} from "react-router-dom";
import {AppContext} from "../State";

const Judge: React.FC = () => {
    const t = useTranslation();
    const { event_id } = useParams<{event_id:string}>();
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>(event_id || undefined);
    const [events, setEvents] = useState<any>();
    const [baloteoTab, setBaloteoTab] = useState<string>("matches");
    const history = useHistory();
    const [showLoading, setShowLoading] = useState<any>(false);

    useEffect(() => {
        state.socket?.on("syncEvents", (payload:any) => {
            if (!payload?.eventId || payload?.eventId === event_id) fetchEvents();
        });
    }, []);

    useIonViewWillEnter(() => {
        fetchEvents();
    })

    const fetchEvents = async () => {
        setShowLoading(true);
        const response = await getOngoingEvents();
        if (response.events) {
            setEvents(response.events);
            const activeEvent = response.events.find((re:any) => re.id === event_id);
            setEvent( activeEvent ? activeEvent : response.events[0]);
            setShowLoading(false);
        }
    };

    const selectEvent = (eventId: string) => {
        const targetEvent = events.find((e:any) => e.id === eventId);
        if (targetEvent) setEvent(targetEvent);
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
                <div className="judge-header">
                    {(events?.length > 0) ? <IonSelect value={event?.id} placeholder="No Baloteo" interface="alert" onIonChange={(e) => selectEvent(e.detail.value!)}>
                        {events.map((e:any) => <IonSelectOption key={e.id} value={e.id}>
                            {(event?.is_special && event?.title) ? event?.title! : t('events.default_event_name')} - {moment(e.event_date).format("MMM D, YYYY")}
                        </IonSelectOption>)}
                    </IonSelect> : <IonText>{t('judge.no_baloteo')}</IonText>}
                    <ProfileModal />
                </div>
                <div className="judge-content">
                    {(!event) ? <IonText className="judge-no-matches">{t('judge.no_baloteo_verbal')}</IonText> :
                        (event?.matches?.length > 0) ? <>
                                <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="judge-tabs-segment">
                                    <IonSegmentButton value="matches"><IonLabel>{t('judge.live_matches')}</IonLabel></IonSegmentButton>
                                    <IonSegmentButton value="results"><IonLabel>{t('judge.results')}</IonLabel></IonSegmentButton>
                                </IonSegment>
                                {(baloteoTab === "results") ? <>
                                    <div className="judge-results-totals">
                                        <div className="judge-results-total">
                                            <IonText>{t('judge.total_matches')}</IonText>
                                            <p>{event?.matches?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>{t('judge.blue_side_wins')}</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 0)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>{t('judge.white_side_wins')}</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 1)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>{t('judge.draws')}</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 2)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>{t('judge.cancelled')}</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 3)?.length || 0}</p>
                                        </div>
                                    </div>
                                    <IonList className="judge-matches">
                                        {event?.matches?.sort((a:any, b:any) => a.number - b.number).filter((m:any) => m.live === false && m.result >= 0).map((match:any, index:number) => <IonItem key={match.id} className="judge-match"  onClick={() => history.push({pathname: "/judge/" + event.id + "/" + match.id, state: {event}})}>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol size="5" className="judge-blue_side">
                                                        {match.result === 0 && <div className="green_chevron"/>}
                                                        {match.participant?.image && <IonImg className={match.participant?.image_flipped ? "judge-match-image flipped" : "judge-match-image"} src={getImageUrl(match.participant?.image)} />}
                                                        {match.participant.team.name}
                                                    </IonCol>
                                                    <IonCol size="2" className="judge-versus">
                                                        <p>{t('baloteo.fight')} {match.number || 1}</p>
                                                        {match.result === 2 && <IonText>{t('judge.draw')}</IonText>}
                                                        {match.result === 3 && <IonText color="danger">{t('judge.cancelled')}</IonText>}
                                                    </IonCol>
                                                    <IonCol size="5" className="judge-white_side">
                                                        {match.opponent.team.name}
                                                        {match.opponent?.image && <IonImg className={match.opponent?.image_flipped ? "judge-match-image" : "judge-match-image flipped"} src={getImageUrl(match.opponent?.image)} />}
                                                        {match.result === 1 && <div className="green_chevron"/>}
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>)}
                                    </IonList>
                                </> : <IonList className="judge-matches">
                                    {event?.matches?.sort((a:any, b:any) => a.number - b.number).filter((m:any) => m.live === true).map((match:any, index:number) => <IonItem key={match.id} className="judge-match" onClick={() => history.push({pathname: "/judge/" + event.id + "/" + match.id, state: {event}})}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="5" className="judge-blue_side">
                                                    {match.participant?.image && <IonImg className={match.participant?.image_flipped ? "judge-match-image flipped" : "judge-match-image"} src={getImageUrl(match.participant?.image)} />}
                                                    {match.participant.team.name}
                                                </IonCol>
                                                <IonCol size="2" className="judge-versus">{t('baloteo.fight')} {match.number || 1}</IonCol>
                                                <IonCol size="5" className="judge-white_side">
                                                    {match.opponent.team.name}
                                                    {match.opponent?.image && <IonImg className={match.opponent?.image_flipped ? "judge-match-image" : "judge-match-image flipped"} src={getImageUrl(match.opponent?.image)} />}
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>)}
                                </IonList>}
                            </> :
                            <IonText className="judge-no-matches">{t('judge.no_matches')}</IonText>
                    }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Judge;
