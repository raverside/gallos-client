import {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent, IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher, IonRefresherContent,
    IonSpinner
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useContext, useEffect, useState} from "react";
import {getEvents} from "../api/Events";
import CreateEventButton from "../components/Events/CreateEventButton";
import EventsList from "../components/Events/EventsList";
import DateFilter from "../components/Events/DateFilter";
import EventsFilter from "../components/Events/EventsFilter";
import EventEditor from "../components/Events/EventEditor";
import moment from 'moment';

import './Events.css';
import {AppContext} from "../State";
import {useTranslation} from "react-multi-lang";

const Events: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [events, setEvents] = useState<Array<{id:string}>>([]);
    const [eventCount, setEventCount] = useState<{today: number, upcoming: number, past: number, dates: []}>({today: 0, upcoming: 0, past: 0, dates: []});
    const [showEventEditorModal, setShowEventEditorModal] = useState<number|boolean>(false);
    const [editorEvent, setEditorEvent] = useState<{}|boolean>(false);
    const [infiniteScrollPage, setInfiniteScrollPage] = useState<number>(1);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<string>(state.user.role === "creator" ? "today" : (state.user.role === "worker" || state.user.role === "admin_manager" || state.user.role === "admin_worker" || state.user.role === "admin") ? moment().format("YYYY-MM-DD") : "" );
    const [eventsFilter, setEventsFilter] = useState<any>({});
    const [eventsFilterQuery, setEventsFilterQuery] = useState<string>("");
    const [eventsSearch, setEventsSearch] = useState<string>("");
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

    useEffect(() => {
        updateFilter();
    }, []);

    const fetchEvents = async (filter = eventsFilterQuery, callback = () => {}) => {
        setLoadingEvents(true);
        const response = await getEvents(filter, 0);
        if (response.events) {
            response.events.sort((a:any, b:any) => {
                return new Date(a.event_date) > new Date(b.event_date) ? 1 : -1;
            });
            setEvents(response.events);
            setEventCount(response.eventCount);
            setInfiniteScrollPage(1);
            setLoadingEvents(false);
        }
        setDisableInfiniteScroll(response?.events?.length < 5);
        callback();
    }

    const searchNext = async ($event: CustomEvent<void>) => {
        const response = await getEvents(eventsFilterQuery, infiniteScrollPage);
        if (response.events?.length > 0) {
            setEvents([...events, ...response.events]);
            setInfiniteScrollPage(infiniteScrollPage + 1);
            setDisableInfiniteScroll(response.events.length < 5);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    const updateFilter = (search = eventsSearch, filter = eventsFilter, datefilter = dateFilter) => {
        let filterQuery = "";
        if (search) {
            filterQuery += "&search="+search;
        }
        if (filter.country) {
            filterQuery += "&country="+filter.country;
        }
        if (filter.state) {
            filterQuery += "&state="+filter.state;
        }
        if (filter.city) {
            filterQuery += "&city="+filter.city;
        }
        if (filter.type) {
            filterQuery += "&type="+filter.type;
        }
        if (filter.sort) {
            filterQuery += "&sort="+filter.sort;
        }
        if (datefilter) {
            filterQuery += "&dateFilter="+datefilter;
        }
        setEventsFilterQuery(filterQuery);
        fetchEvents(filterQuery);
    }

    return (
        <IonPage>
            <Header title={state.user.role === "creator" ? t('events.my_events') : t('events.events')} isRed={false} notifications={false}/>

            <IonContent fullscreen>
                {(state.user.role === "creator") && <IonSegment className="events-tabs" value={(dateFilter === "upcoming" || dateFilter === "today") ? dateFilter : "past"} onIonChange={(e) => {setDateFilter(e.detail.value!); updateFilter(eventsSearch, eventsFilter, e.detail.value!)}}>
                    <IonSegmentButton value="today">
                        <IonLabel>{t('events.today')}{eventCount.today > 0 && <span className="barely-visible"> • {eventCount.today}</span>}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="upcoming">
                        <IonLabel>{t('events.upcoming')}{eventCount.upcoming > 0 && <span className="barely-visible"> • {eventCount.upcoming}</span>}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="past">
                        <IonLabel>{t('events.past')}{eventCount.past > 0 && <span className="barely-visible"> • {eventCount.past}</span>}</IonLabel>
                    </IonSegmentButton>
                </IonSegment>}
                {((state.user.role === "worker" || state.user.role === "admin_manager" || state.user.role === "admin_worker" || state.user.role === "admin") || (state.user.role === "creator" && dateFilter !== "upcoming" && dateFilter !== "today")) &&
                    <DateFilter
                        eventDates={eventCount.dates}
                        filter={dateFilter}
                        setFilter={(filter) => setDateFilter(filter)}
                        updateFilter={(date) => updateFilter(eventsSearch, eventsFilter, date)}
                    />
                }
                {(state.user.role === "admin_manager" || state.user.role === "admin_worker" || state.user.role === "admin") &&
                    <EventsFilter
                        filter={eventsFilter}
                        setFilter={(filter) => setEventsFilter(filter)}
                        search={eventsSearch}
                        setSearch={(filter) => setEventsSearch(filter)}
                        updateFilter={(search, filter) => updateFilter(search, filter)}
                    />
                }
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvents(eventsFilterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                {loadingEvents ? <IonSpinner color="primary" style={{width: "100%"}} /> : <EventsList openEditor={(event:{}) => {setEditorEvent(event); setShowEventEditorModal(3)}} events={events} />}
                <IonInfiniteScroll disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>
                {(state.user.role === "admin_manager" || state.user.role === "admin_worker" || state.user.role === "admin" || state.user.role === "creator") &&
                    <CreateEventButton showEventEditor={setShowEventEditorModal} />
                }
                <IonModal isOpen={!!showEventEditorModal} onDidDismiss={() => setShowEventEditorModal(false)}>
                    <EventEditor
                        fetchEvents={fetchEvents}
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
