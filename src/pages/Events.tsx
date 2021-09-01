import {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent, IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher, IonRefresherContent
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useEffect, useState} from "react";
import {getEvents} from "../api/Events";
import CreateEventButton from "../components/Events/CreateEventButton";
import EventsList from "../components/Events/EventsList";
import EventEditor from "../components/Events/EventEditor";
import moment from 'moment';

import './Events.css';

const Events: React.FC = () => {
    const [events, setEvents] = useState<Array<{id:string}>>([]);
    const [eventCount, setEventCount] = useState<{today: number, upcoming: number, past: number}>({today: 0, upcoming: 0, past: 0});
    const [showEventEditorModal, setShowEventEditorModal] = useState<number|boolean>(false);
    const [editorEvent, setEditorEvent] = useState<{}|boolean>(false);
    const [infiniteScrollPage, setInfiniteScrollPage] = useState<number>(1);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<string>("today");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (filter = dateFilter, callback = () => {}) => {
        const response = await getEvents(filter, 0);
        if (response.events) {
            response.events.sort((a:any, b:any) => {
                return new Date(a.event_date) > new Date(b.event_date) ? 1 : -1;
            });
            setEvents(response.events);
            setEventCount(response.eventCount);
            setInfiniteScrollPage(1);
        };
        setDisableInfiniteScroll(response.events?.length < 5);
        callback();
    }

    const addEvent = (event:{id:string, event_date:string}) => {
        const existingEvents = [...events];
        const existingEventIndex = existingEvents.findIndex(e => e.id === event.id);
        const dateDiff = moment().diff(moment(event.event_date), 'days');
        const eventTab = dateDiff < 0 ? "upcoming" : ((dateDiff > 0) ? "past" : "today");
        const updatedEventCount = eventCount;
        updatedEventCount[eventTab] = eventCount[eventTab] + 1;
        setEventCount(updatedEventCount);

        if (eventTab !== dateFilter) return;

        if (existingEventIndex >= 0) {
            existingEvents[existingEventIndex] = event;
            setEvents(existingEvents);
        } else {
            const updatedEvents = [event, ...existingEvents];
            updatedEvents.sort((a:any, b:any) => {
                return moment(a.event_date) > moment(b.event_date) ? 1 : -1;
            });
            setEvents(updatedEvents);
        }
    }

    const searchNext = async ($event: CustomEvent<void>) => {
        const response = await getEvents(dateFilter, infiniteScrollPage);
        if (response.events?.length > 0) {
            setEvents([...events, ...response.events]);
            setInfiniteScrollPage(infiniteScrollPage + 1);
            setDisableInfiniteScroll(response.events.length < 5);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <Header title="My Events" isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <IonSegment className="events-tabs" value={dateFilter} onIonChange={(e) => {setDateFilter(e.detail.value!); fetchEvents(e.detail.value!)}}>
                    <IonSegmentButton value="today">
                        <IonLabel>Today{eventCount.today > 0 && <span className="barely-visible"> • {eventCount.today}</span>}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="upcoming">
                        <IonLabel>Upcoming{eventCount.upcoming > 0 && <span className="barely-visible"> • {eventCount.upcoming}</span>}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="past">
                        <IonLabel>Past{eventCount.past > 0 && <span className="barely-visible"> • {eventCount.past}</span>}</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvents(dateFilter, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                <EventsList openEditor={(event:{}) => {setShowEventEditorModal(3); setEditorEvent(event)}} events={events} />
                <IonInfiniteScroll disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>
                <CreateEventButton showEventEditor={setShowEventEditorModal} />
                <IonModal isOpen={!!showEventEditorModal} onDidDismiss={() => setShowEventEditorModal(false)}>
                    <EventEditor
                        addEvent={addEvent}
                        isSpecial={showEventEditorModal === 1}
                        event={showEventEditorModal === 3 ? editorEvent : false}
                        close={() => setShowEventEditorModal(false)}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Events;
