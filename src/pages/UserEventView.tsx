import {
    IonContent,
    IonPage,
    IonImg,
    IonText,
    IonToolbar,
    IonButton,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonAvatar,
    IonRouterLink,
    IonIcon,
    IonLoading,
    IonSegmentButton,
    IonLabel,
    IonSegment,
    IonCard,
    IonGrid,
    IonRow, IonCol, IonSearchbar, IonList, IonItem} from '@ionic/react';
import Gallery from '../components/Gallery';
import React, {useContext, useEffect, useState} from "react";
import {getEvent} from "../api/Events";
import {useParams} from 'react-router-dom';
import {formatOzToLbsOz, getImageUrl} from '../components/utils';

import './EventView.css';
import fullscreenIcon from "../img/fullscreen.png";
import moment from "moment";
import {shareSocialOutline as shareIcon} from "ionicons/icons";
import ShareEventImage from "../components/Events/ShareEventImage";
import {useHistory} from "react-router-dom";
import {AppContext} from "../State";

// @ts-ignore
import domtoimage from "dom-to-image-improved";
import {useTranslation} from "react-multi-lang";

type eventType = any;

const UserEventView: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const { id } = useParams<{id:string}>();
    const [event, setEvent] = useState<eventType>();
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<eventType|false>(false);
    const [baloteoTab, setBaloteoTab] = useState<string>("receiving");
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const history = useHistory();
    const shareRef = React.useRef();

    useEffect(() => {
        fetchEvent();
        state.socket.on("syncEvents", () => {
            fetchEvent();
        });
    }, []);

    const fetchEvent = async () => {
        setShowLoading(true);
        const response = (id) ? await getEvent(id) : false;
        if (response.event) {
            setEvent(response.event);
            setShowLoading(false);
            if (baloteoTab === "receiving" && response.event.phase !== "receiving") {
                setBaloteoTab("matches");
            }
        } else {
            history.replace("/events");
            setShowLoading(false);
        }
    }

    const shareEvent = async () => {
        if (!event) return false;
        const element = shareRef.current;
        setShowShare(event);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".jpg", { type: "image/jpeg" });

            //download the file
            const a = document.createElement("a");
            a.href  = window.URL.createObjectURL(file);
            a.setAttribute("download", file.name);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            const filesArray:any = [file];
            setShowShare(false);

            //share the file
            // @ts-ignore
            if (navigator.share && navigator.canShare && navigator.canShare({ files: filesArray })) {
                navigator.share({title: event.title || t('events.default_event_name'), files: filesArray});
            }
        });
    }

    const title = (event?.is_special && event?.title) ? event?.title! : t('events.default_event_name');
    const image = (event?.is_special && event?.image) ? getImageUrl(event?.image!) : getImageUrl(event?.stadium_image!);
    const matches = (event && baloteoSearch) ? event.matches?.filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name.toLowerCase().includes(baloteoSearch.toLowerCase()) || m.opponent?.team?.name.toLowerCase().includes(baloteoSearch.toLowerCase())) : event?.matches;
    const liveMatches = matches?.filter((m:any) => m.live) || [];
    const completeMatches = matches?.filter((m:any) => !m.live && m.result !== null) || [];
    const activeMatches = (baloteoTab === "results") ? completeMatches : liveMatches;

    return !event ? null : (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader className="event-view-header">
                    <IonToolbar className="arrow-header">
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/events"/>
                        </IonButtons>
                        <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={shareIcon} slot="end" onClick={() => shareEvent()} /></IonButtons>
                    </IonToolbar>
                </IonHeader>
                <div className="event-big-image">
                    <IonImg src={image}/>
                    <IonImg src={fullscreenIcon} onClick={() => setShowFullscreen(true)} className="fullscreen-icon" />
                </div>
                <div className="event-content-wrapper">
                    <IonCardTitle>{title}</IonCardTitle>
                    <IonCardSubtitle>{moment(event?.event_date).format("dddd, D MMMM YYYY")}</IonCardSubtitle>
                    <IonRouterLink className="event-stadium" routerLink={"/stadium/"+event?.stadium_id}><IonAvatar><IonImg src={getImageUrl(event?.stadium_image)}/></IonAvatar><span>{event?.stadium_name}</span></IonRouterLink>
                    <IonText>{event?.description}</IonText>
                </div>

                {(event.phase === "receiving") ? <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="receiving"><IonLabel>{t('events.tab_receiving')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="results"><IonLabel>{t('events.tab_results')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="statistics"><IonLabel>{t('events.tab_statistics')}</IonLabel></IonSegmentButton>
                </IonSegment> : <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="matches"><IonLabel>{t('events.tab_matches')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="results"><IonLabel>{t('events.tab_results')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="statistics"><IonLabel>{t('events.tab_statistics')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="animals"><IonLabel>{t('events.tab_animals')}</IonLabel></IonSegmentButton>
                </IonSegment>}

                {(baloteoTab === "matches" || baloteoTab === "results") && ((!activeMatches?.length) ? <p className="baloteo-emptylist">{t('events.no_live_matches')}</p> : <div className="baloteo-matches">
                    <IonSearchbar className="searchbar" placeholder={t('events.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                    <IonGrid className="baloteo-match">
                        <IonRow className="baloteo-side-header">
                            <IonCol size="5">
                                <div className="blue_side">
                                    <div className="baloteo-match-blue_side">{t('baloteo.blue_side')}</div>
                                </div>
                            </IonCol>
                            <IonCol size="2" />
                            <IonCol size="5">
                                <div className="white_side">
                                    <div className="baloteo-match-white_side">{t('baloteo.white_side')}</div>
                                </div>
                            </IonCol>
                        </IonRow>
                        {activeMatches.map((match:any, index:number) => (
                            <IonGrid className="baloteo-match-wrapper">
                                <IonRow>
                                    <IonCol size="5">
                                        <div className="blue_side">
                                            <IonImg className={match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image"} src={getImageUrl(match.participant?.image)} />
                                            <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {index + 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                        {match.manual && <p className="baloteo-match-manual">Manual</p>}
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className="white_side">
                                            <IonImg className={match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped"} src={getImageUrl(match.opponent?.image)} />
                                            <p className="baloteo-match-team_name">{match.opponent?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                </IonRow>
                                {(match.result !== null) && <IonRow>
                                    <IonCol size="8" offset="2">
                                        {match.result === 0 && <IonText color="tertiary">{t('baloteo.blue_side_wins')}{(match.match_time) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 1 && <IonText>{t('baloteo.white_side_wins')}{(match.match_time) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 2 && <IonText>{t('baloteo.draw')}{(match.match_time) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 3 && <IonText color="primary">{t('baloteo.cancelled')}</IonText>}
                                    </IonCol>
                                    {/*<IonCol size="2">*/}
                                    {/*    <IonButton fill="clear" color="dark" className="printMenu" onClick={() => present({*/}
                                    {/*        buttons: [*/}
                                    {/*            { text: 'Share this match', handler: () => {} },*/}
                                    {/*            { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}*/}
                                    {/*        ],*/}
                                    {/*        header: 'Settings'*/}
                                    {/*    })}><IonIcon size="small" icon={menuIcon} /></IonButton>*/}
                                    {/*</IonCol>*/}
                                </IonRow>}
                            </IonGrid>
                        ))}
                    </IonGrid>
                </div>)}
                {(baloteoTab === "receiving" || baloteoTab === "animals") && <div className="baloteo-participants">
                    {(baloteoTab) === "animals" && <>
                        <IonCard className="baloteo-stats-card">
                            <p>{t('baloteo.total_animals_received')}</p>
                            <span>{event.participants?.length}</span>
                        </IonCard>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4">
                                    <IonCard className="baloteo-stats-card">
                                        <p>{t('baloteo.lowest_animal_weight')}</p>
                                        <span>{formatOzToLbsOz(""+Math.min(...event.participants.map((p:any) => parseFloat(p.weight))))}</span>
                                    </IonCard>
                                </IonCol>
                                <IonCol size="4">
                                    <IonCard className="baloteo-stats-card">
                                        <p>{t('baloteo.average_weight')}</p>
                                        <span>{formatOzToLbsOz(""+event.participants.reduce((total:any, next:any) => total + parseFloat(next.weight), 0) / event.participants.length || "0")}</span>
                                    </IonCard>
                                </IonCol>
                                <IonCol size="4">
                                    <IonCard className="baloteo-stats-card">
                                        <p>{t('baloteo.highest_animal_weight')}</p>
                                        <span>{formatOzToLbsOz(""+Math.max(...event.participants.map((p:any) => parseFloat(p.weight))))}</span>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </>}
                    <IonSearchbar className="searchbar" placeholder={t('events.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                    {event.participants?.length > 0 && <IonList>
                        {event.participants
                            .filter((p:any) => !baloteoSearch || +p.cage === +baloteoSearch || p.team?.name.toLowerCase().includes(baloteoSearch.toLowerCase()))
                            .sort((a:any, b:any) => a.team?.name - b.team?.name)
                            .map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="2">{participant.cage}</IonCol>
                                    <IonCol size="6">
                                        {participant.image && <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"} />}
                                        <div className="baloteo-participant-creds">
                                            <div className="baloteo-participant-name">{participant.team?.name}</div>
                                            {(participant.status === "approved") && <div className="baloteo-participant-status green">{participant.status}</div>}
                                            {(participant.status === "rejected") && <div className="baloteo-participant-status red">{participant.status}</div>}
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <div className="baloteo-participant-creds">
                                            <div className="baloteo-participant-type">{participant.type}</div>
                                            <div className="baloteo-participant-type">{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <IonButton fill="clear" color="dark" onClick={() => {}}><IonIcon className="view-note-menu" icon={shareIcon} /></IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>)}
                    </IonList>}
                </div>}

                <Gallery
                    title={title}
                    showModal={showFullscreen}
                    setShowModal={setShowFullscreen}
                    images={[image]}
                />
                <div style={showShare ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareEventImage event={event} close={() => setShowShare(false)}  ref={shareRef} />
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

export default UserEventView;