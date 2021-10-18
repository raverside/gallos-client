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
                                <IonList className="judge-matches">
                                    {event.matches.map((match:any, index:number) => <IonItem key={match.id} className="judge-match" routerLink={"/judge/"+event.id+"/"+match.id}>
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
                                </IonList>
                            </> :
                            <IonText className="judge-no-matches">Matches are not announced yet</IonText>
                    }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Judge;