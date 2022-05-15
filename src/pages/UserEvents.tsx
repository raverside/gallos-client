import {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher, IonRefresherContent, IonIcon, IonImg, IonText, IonItem,
    IonGrid, IonRow, IonCol, IonSelectOption, IonSelect, IonSpinner,
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useContext, useEffect, useState} from "react";
import {getEvents, getStatisticsByStadium} from "../api/Events";
import EventsList from "../components/Events/EventsList";
import DateFilter from "../components/Events/DateFilter";
import moment from 'moment';

import {calendarOutline as calendarIcon, closeOutline as closeIcon, statsChart as chartIcon} from "ionicons/icons";

import './Events.css';
import {AppContext} from "../State";
import {fetchAllStadiums} from "../api/Stadiums";
import StadiumsList from "../components/Stadiums/StadiumsList";
import {getImageUrl} from "../components/utils";
import medalIcon from "../img/medal.png";
import {useTranslation} from "react-multi-lang";

const UserEvents: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [events, setEvents] = useState<Array<{id:string}>>([]);
    const [eventCount, setEventCount] = useState<{today: number, upcoming: number, past: number, dates: []}>({today: 0, upcoming: 0, past: 0, dates: []});
    const [infiniteScrollPage, setInfiniteScrollPage] = useState<number>(1);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<string>(moment().format("YYYY-MM-DD"));
    const [eventsFilterQuery, setEventsFilterQuery] = useState<string>("");
    const [tabSelected, setTabSelected] = useState<string>("events");
    const [stadiumSelected, setStadiumSelected] = useState<any>(false);
    const [stadiums, setStadiums] = useState<any[]>([]);
    const [statisticTab, setStatisticTab] = useState<string>("average");
    const [statisticsData, setStatisticsData] = useState<any[]>([]);
    const [statisticsDateFilter, setStatisticsDateFilter] = useState<any>({
        start: moment().startOf("month").format("YYYY-MM-DD"),
        end: moment().endOf("month").format("YYYY-MM-DD")
    });
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

    useEffect(() => {
        if (stadiumSelected && statisticTab) {
            fetchStatistics();
        }
    }, [stadiumSelected, statisticTab, statisticsDateFilter]);

    useEffect(() => {
        updateFilter();
        fetchStadiums();
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
        setDisableInfiniteScroll(response.events?.length < 5);
        callback();
    }

    const fetchStadiums = async() => {
        const response = await fetchAllStadiums();
        if (response.stadiums) {
            setStadiums(response.stadiums);
        }
    }

    const fetchStatistics = async() => {
        const {statistics} = await getStatisticsByStadium(stadiumSelected.id, statisticTab, statisticsDateFilter);
        if (statistics) setStatisticsData(statistics);
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

    const updateFilter = (datefilter = dateFilter) => {
        let filterQuery = "";
        if (datefilter) {
            filterQuery += "&dateFilter="+datefilter;
        }
        setEventsFilterQuery(filterQuery);
        fetchEvents(filterQuery);
    }

    return (
        <IonPage>
            <Header title="Gallos Club" isRed={true} notifications={true}/>

            <IonContent fullscreen>
                <IonSegment value={tabSelected} onIonChange={(e) => setTabSelected(e.detail.value!)} className="events-segment">
                    <IonSegmentButton value="events"><IonLabel><IonIcon icon={calendarIcon} />{t('events.events')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="statistic"><IonLabel><IonIcon icon={chartIcon} />{t('events.statistic')}</IonLabel></IonSegmentButton>
                </IonSegment>

                {tabSelected === "events" && <>
                    <DateFilter
                        eventDates={eventCount.dates}
                        filter={dateFilter}
                        setFilter={(filter) => setDateFilter(filter)}
                        updateFilter={(date) => updateFilter(date)}
                    />

                    <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvents(eventsFilterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                    {loadingEvents ? <IonSpinner color="primary" style={{width: "100%"}} /> : <EventsList events={events} />}
                    <IonInfiniteScroll disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                        <IonInfiniteScrollContent />
                    </IonInfiniteScroll>
                </>}
                {tabSelected === "statistic" && <div className="user-statistics">
                    {!stadiumSelected ? <StadiumsList stadiums={stadiums} selectStadium={(stadium) => setStadiumSelected(stadium)} /> : <>
                        <IonItem
                            lines="none"
                            className="stadium"
                        >
                            <IonImg className="stadium-image" src={getImageUrl(stadiumSelected.image)} />
                            <IonLabel className="stadium-short-info">
                                <p className="stadium-short-info_name">{stadiumSelected.name}</p>
                                <p className="stadium-short-info_representative">{stadiumSelected.representative_name}</p>
                                <IonText className="stadium-short-info_membership" color="gold">Gold</IonText>
                                <p className="stadium-short-info_location">{stadiumSelected.city}, {stadiumSelected.country}</p>
                            </IonLabel>
                            <IonButton fill="clear" color="dark" className="cancel-stadium-selected" onClick={() => setStadiumSelected(false)}><IonIcon slot="icon-only" icon={closeIcon}/></IonButton>
                        </IonItem>
                        <IonSegment scrollable className="events-tabs baloteo-tabs" value={statisticTab} onIonChange={(e) => {setStatisticsData([]); setStatisticTab(e.detail.value!)}}>
                            <IonSegmentButton value="average"><IonLabel>{t('events.statistic_ba')}</IonLabel></IonSegmentButton>
                            <IonSegmentButton value="totm"><IonLabel>{t('events.statistic_totm')}</IonLabel></IonSegmentButton>
                            <IonSegmentButton value="twmw"><IonLabel>{t('events.statistic_twmw')}</IonLabel></IonSegmentButton>
                            <IonSegmentButton value="fastest"><IonLabel>{t('events.statistic_fm')}</IonLabel></IonSegmentButton>
                        </IonSegment>
                        {statisticTab === "totm" && <div className="statistic_datepicker">
                            <IonSegment scrollable className="events-tabs baloteo-tabs" value={""+moment(statisticsDateFilter.start).get('month')} onIonChange={(e) => setStatisticsDateFilter({
                                start: moment(statisticsDateFilter.start).month(+e.detail.value!).format("YYYY-MM-DD"),
                                end: moment(statisticsDateFilter.end).month(+e.detail.value!).format("YYYY-MM-DD")
                            })}>
                                <IonSegmentButton value="0"><IonLabel>January</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="1"><IonLabel>February</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="2"><IonLabel>March</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="3"><IonLabel>April</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="4"><IonLabel>May</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="5"><IonLabel>June</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="6"><IonLabel>July</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="7"><IonLabel>August</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="8"><IonLabel>September</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="9"><IonLabel>October</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="10"><IonLabel>November</IonLabel></IonSegmentButton>
                                <IonSegmentButton value="11"><IonLabel>December</IonLabel></IonSegmentButton>
                            </IonSegment>
                            <IonSelect interface="alert" name="datefilter" value={moment(statisticsDateFilter.start).format("YYYY")} onIonChange={(e) => setStatisticsDateFilter({
                                start: moment(statisticsDateFilter.start).year(+e.detail.value!).format("YYYY-MM-DD"),
                                end: moment(statisticsDateFilter.end).year(+e.detail.value!).format("YYYY-MM-DD")
                            })}>
                                <IonSelectOption value={moment().startOf("year").format("YYYY")}>{moment().format("YYYY")}</IonSelectOption>
                                <IonSelectOption value={moment().startOf("year").subtract(1, 'year').format("YYYY")}>{moment().subtract(1, 'year').format("YYYY")}</IonSelectOption>
                                {/*<IonSelectOption value={moment().startOf("year").subtract(2, 'year').format("YYYY")}>{moment().subtract(2, 'year').format("YYYY")}</IonSelectOption>*/}
                            </IonSelect>
                        </div>}
                        {(!statisticsData.length) ? <IonText className="empty-list">{t('events.statistic_not_available')}</IonText> : <>
                            {(statisticTab === "average" || statisticTab === "totm") && <>
                                <div className="statistics-winner">
                                    <div className="statistics-winner-data">
                                        <p>{statisticsData[0].name}</p>
                                        <IonText className="teamOwner-short-info_winrate">{Math.max(0, +statisticsData[0].wins)} {t('teams.wins')} • {Math.max(0, +statisticsData[0].loses)} {t('teams.loses')} • {Math.min(100, Math.max(0, Math.round(+statisticsData[0].wins / Math.max(1, (+statisticsData[0].wins || 0) + (+statisticsData[0].draws || 0) + (+statisticsData[0].loses || 0)) * 100)))}%</IonText>
                                    </div>
                                    <IonImg className="medal" src={medalIcon}/>
                                </div>
                                <IonGrid className="stats-grid">
                                    <IonRow>
                                        <IonCol>#</IonCol>
                                        <IonCol>{t('teams.name')}</IonCol>
                                        <IonCol>{t('teams.w')}</IonCol>
                                        <IonCol>{t('teams.l')}</IonCol>
                                        <IonCol>%</IonCol>
                                    </IonRow>
                                    {statisticsData.map((row, i) => i > 0 && (
                                        <IonRow key={i + 1}>
                                            <IonCol>{moment.localeData().ordinal(i + 1)}</IonCol>
                                            <IonCol style={{textTransform: "uppercase"}}>{row.name}</IonCol>
                                            <IonCol>{row.wins}</IonCol>
                                            <IonCol>{row.loses}</IonCol>
                                            <IonCol>{Math.min(100, Math.max(0, Math.round(+row.wins / Math.max(1, (+row.wins || 0) + (+row.loses || 0)) * 100)))}%</IonCol>
                                        </IonRow>
                                    ))}
                                </IonGrid>
                            </>}
                            {(statisticTab === "twmw") && <>
                                <div className="statistics-winner">
                                    <div className="statistics-winner-data">
                                        <p style={{textTransform: "uppercase"}}>{statisticsData[0].name}</p>
                                        <IonText className="teamOwner-short-info_winrate">{statisticsData[0].wins}</IonText>
                                    </div>
                                    <IonImg className="medal" src={medalIcon}/>
                                </div>
                                <IonGrid className="stats-grid">
                                    <IonRow>
                                        <IonCol>#</IonCol>
                                        <IonCol>{t('teams.name')}</IonCol>
                                        <IonCol>{t('teams.wins')}</IonCol>
                                    </IonRow>
                                    {statisticsData.map((row, i) => i > 0 && (
                                        <IonRow key={i + 1}>
                                            <IonCol>{moment.localeData().ordinal(i + 1)}</IonCol>
                                            <IonCol style={{textTransform: "uppercase"}}>{row.name}</IonCol>
                                            <IonCol>{row.wins}</IonCol>
                                        </IonRow>
                                    ))}
                                </IonGrid>
                            </>}
                            {(statisticTab === "fastest") && <>
                                <div className="statistics-winner">
                                    <div className="statistics-winner-data">
                                        <p>{statisticsData[0]?.matches[0]?.participant?.team?.name} vs {statisticsData[0]?.matches[0]?.opponent?.team?.name}</p>
                                        <IonText className="teamOwner-short-info_winrate">{moment.utc(statisticsData[0]?.matches[0].match_time*1000).format('mm:ss')}</IonText>
                                        <IonText className="teamOwner-short-info_winrate">{statisticsData[0]?.title || t('events.default_event_name')}</IonText>
                                    </div>
                                    <IonImg className="medal" src={medalIcon}/>
                                </div>
                            </>}
                        </>}
                    </>}
                </div>}
            </IonContent>
        </IonPage>
    );
};

export default UserEvents;
