import React, {useEffect, useState} from "react";
import {getOngoingEvents} from "../api/Events";
import {
    IonContent,
    IonPage,
    IonSelectOption,
    IonSelect,
    IonText,
    IonSegmentButton,
    IonLabel,
    IonSegment,
    IonList,
    IonItem,
    IonGrid, IonRow, IonCol, IonImg,
} from '@ionic/react';
import ProfileModal from '../components/Judge/ProfileModal';

import './Judge.css';
import {getImageUrl} from "../components/utils";

const Judge: React.FC = () => {
    const [event, setEvent] = useState<any>();
    const [events, setEvents] = useState<any>();
    const [baloteoTab, setBaloteoTab] = useState<string>("matches");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const response = await getOngoingEvents();
        if (response.events) {
            setEvents(response.events);
            setEvent(response.events[0]);
        }
    };

    const selectEvent = (eventId: string) => {
        const targetEvent = events.find((e:any) => e.id === eventId);
        if (targetEvent) setEvent(targetEvent);
    };

    const title = (event?.is_special && event?.title) ? event?.title! : "Traditional Events";

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="judge-header">
                    {(events?.length > 0) ? <IonSelect value={event?.id} placeholder="No Baloteo" interface="alert" onIonChange={(e) => selectEvent(e.detail.value!)}>
                        {events.map((e:any) => <IonSelectOption key={e.id} value={e.id}>{title}</IonSelectOption>)}
                    </IonSelect> : <IonText>No Baloteo</IonText>}
                    <ProfileModal />
                </div>
                <div className="judge-content">
                    {(!event) ? <IonText className="judge-no-matches">No Baloteo for you right now</IonText> :
                        (event?.matches?.length > 0) ? <>
                                <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="judge-tabs-segment">
                                    <IonSegmentButton value="matches"><IonLabel>Live Matches</IonLabel></IonSegmentButton>
                                    <IonSegmentButton value="results"><IonLabel>Results</IonLabel></IonSegmentButton>
                                </IonSegment>
                                {(baloteoTab === "results") ? <>
                                    <div className="judge-results-totals">
                                        <div className="judge-results-total">
                                            <IonText>Total Matches</IonText>
                                            <p>{event?.matches?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>Blue Side Wins</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 0)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>White Side Wins</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 1)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>Draws</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 2)?.length || 0}</p>
                                        </div>
                                        <div className="judge-results-total">
                                            <IonText>Cancelled</IonText>
                                            <p>{event?.matches?.filter((m:any) => m.result === 3)?.length || 0}</p>
                                        </div>
                                    </div>
                                    <IonList className="judge-matches">
                                        {event.matches.filter((m:any) => m.live === false && m.result >= 0).map((match:any, index:number) => <IonItem key={match.id} className="judge-match">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol size="5" className="judge-blue_side">
                                                        {match.result === 0 && <div className="green_chevron"/>}
                                                        {match.participant?.image && <IonImg className={match.participant?.image_flipped ? "judge-match-image flipped" : "judge-match-image"} src={getImageUrl(match.participant?.image)} />}
                                                        {match.participant.team.name}
                                                    </IonCol>
                                                    <IonCol size="2" className="judge-versus">
                                                        <p>Pelea {index+1}</p>
                                                        {match.result === 2 && <IonText>Draw</IonText>}
                                                        {match.result === 3 && <IonText color="danger">Cancelled</IonText>}
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
                                    {event.matches.filter((m:any) => m.live === true).map((match:any, index:number) => <IonItem key={match.id} className="judge-match" routerLink={"/judge/"+event.id+"/"+match.id}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="5" className="judge-blue_side">
                                                    <IonImg className={match.participant?.image_flipped ? "judge-match-image flipped" : "judge-match-image"} src={getImageUrl(match.participant?.image)} />
                                                    {match.participant.team.name}
                                                </IonCol>
                                                <IonCol size="2" className="judge-versus">Pelea {index+1}</IonCol>
                                                <IonCol size="5" className="judge-white_side">
                                                    {match.opponent.team.name}
                                                    <IonImg className={match.opponent?.image_flipped ? "judge-match-image" : "judge-match-image flipped"} src={getImageUrl(match.opponent?.image)} />
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>)}
                                </IonList>}
                            </> :
                            <IonText className="judge-no-matches">Matches are not announced yet</IonText>
                    }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Judge;
