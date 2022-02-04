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
    IonModal,
    IonRow, IonCol, IonSearchbar, IonList, IonItem, IonRefresherContent, IonRefresher
} from '@ionic/react';
import Gallery from '../components/Gallery';
import React, {useContext, useEffect, useState} from "react";
import {getEvent} from "../api/Events";
import {useParams} from 'react-router-dom';
import {formatOzToLbsOz, getImageUrl, getParticipantBettingAmount, isDesktop} from '../components/utils';

import './EventView.css';
import fullscreenIcon from "../img/fullscreen.png";
import moment from "moment";
import {shareSocialOutline as shareIcon} from "ionicons/icons";
import ShareEventImage from "../components/Events/ShareEventImage";
import ShareParticipantImage from "../components/Events/ShareParticipantImage";
import ParticipantDetails from "../components/Events/ParticipantDetails";
import CompareMatch from "../components/Events/CompareMatch";
import {useHistory} from "react-router-dom";
import {AppContext} from "../State";
import compareIcon from "../img/compare.png";

// @ts-ignore
import domtoimage from "dom-to-image-improved";
import {useTranslation} from "react-multi-lang";
import ParticipantGallery from "../components/Events/ParticipantGallery";
import ShareMatchImage from "../components/Events/ShareMatchImage";

type eventType = any;

const UserEventView: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const { id } = useParams<{id:string}>();
    const [event, setEvent] = useState<eventType>();
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<eventType|false>(false);
    const [showShareParticipant, setShowShareParticipant] = useState<any>(false);
    const [showShareMatch, setShowShareMatch] = useState<any>(false);
    const [showParticipantDetails, setShowParticipantDetails] = useState<any>(false);
    const [showCompareMatch, setShowCompareMatch] = useState<any>(false);
    const [baloteoTab, setBaloteoTab] = useState<string>("receiving");
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [selectedGalleryParticipant, setSelectedGalleryParticipant] = useState<any>(false);
    const [showGalleryImage, setShowGalleryImage] = useState<boolean>(false);
    const history = useHistory();
    const shareRef = React.useRef();
    const shareMatchRef = React.useRef();
    const shareParticipantRef = React.useRef();

    useEffect(() => {
        setShowLoading(true);
        fetchEvent(() => setShowLoading(false));
        state.socket.on("syncEvents", (payload:any) => {
            if (!payload?.eventId || payload?.eventId === id) fetchEvent();
        });
    }, []);

    const viewParticipantImage = (participant:any) => {
        setSelectedGalleryParticipant(participant);
        setShowGalleryImage(true);
    }

    const fetchEvent = async (callback = () => {}) => {
        const response = (id) ? await getEvent(id) : false;
        if (response.event) {
            setEvent(response.event);
            if (baloteoTab === "receiving" && response.event.phase !== "receiving" && response.event.phase !== "arrangement") {
                setBaloteoTab("matches");
            }
            if (response.event.phase === "complete" && (baloteoTab === "matches" || baloteoTab === "receiving")) {
                setBaloteoTab("results");
            }
        } else {
            history.replace("/events");

        }
        callback();
    }

    const shareEvent = async () => {
        if (!event) return false;
        setShowLoading(true);
        const element = shareRef.current;
        setShowShare(event);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: blob.type });
            const filesArray:any = [file];
            setShowShare(false);

            if (isDesktop() || !(navigator.canShare && navigator.canShare({files: filesArray}))) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                navigator.share({files: filesArray});
            }
            setShowLoading(false);
        });
    }

    const shareMatch = async (match:any) => {
        if (!match) return false;
        setShowLoading(true);
        const element = shareMatchRef.current;
        setShowShareMatch(match);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: blob.type });
            const filesArray:any = [file];
            setShowShareMatch(false);

            if (isDesktop() || !(navigator.canShare && navigator.canShare({files: filesArray}))) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                navigator.share({files: filesArray});
            }
            setShowLoading(false);
        });
    }

    const shareParticipant = async (participant:any) => {
        if (!participant) return false;
        setShowLoading(true);
        const element = shareParticipantRef.current;
        setShowShareParticipant(participant);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: blob.type });
            const filesArray:any = [file];
            setShowShareParticipant(false);

            if (isDesktop() || !(navigator.canShare && navigator.canShare({files: filesArray}))) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                navigator.share({files: filesArray});
            }
            setShowLoading(false);
        });
    }

    const title = (event?.is_special && event?.title) ? event?.title! : t('events.default_event_name');
    const image = (event?.is_special && event?.image) ? getImageUrl(event?.image!) : getImageUrl(event?.stadium_image!);
    const matches = (event && baloteoSearch) ? event.matches?.sort((a:any, b:any) => a.number - b.number).filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name.toLowerCase().includes(baloteoSearch.toLowerCase()) || m.opponent?.team?.name.toLowerCase().includes(baloteoSearch.toLowerCase())) : event?.matches?.sort((a:any, b:any) => a.number - b.number);
    const liveMatches = (event?.phase === "on going") ? matches?.filter((m:any) => m.live).sort((a:any, b:any) => a.manual - b.manual) || [] : [];
    const completeMatches = matches?.filter((m:any) => !m.live && m.result !== null) || [];
    const activeMatches = (baloteoTab === "results") ? completeMatches : liveMatches;

    return !event?.id ? <IonLoading isOpen={true} spinner="crescent" /> : (
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

                {(event.phase === "receiving" || event.phase === "arrangement") ? <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="user-profile-tabs-segment">
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
                            <IonGrid className="baloteo-match-wrapper" key={index}>
                                <IonRow>
                                    <IonCol size="5">
                                        <div className="blue_side">
                                            <IonImg
                                                className={match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image"}
                                                src={getImageUrl(match.participant?.image)}
                                                onClick={() => match.participant?.image && viewParticipantImage(match.participant)}
                                            />
                                            <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {match.number || 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                        {match.manual && <p className="baloteo-match-manual">Manual</p>}
                                        <IonButton fill="clear" expand="block" className="compare-button" onClick={() => setShowCompareMatch(match)}><img src={compareIcon}/></IonButton>
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className="white_side">
                                            <IonImg
                                                className={match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped"}
                                                src={getImageUrl(match.opponent?.image)}
                                                onClick={() => match.opponent?.image && viewParticipantImage(match.opponent)}
                                            />
                                            <p className="baloteo-match-team_name">{match.opponent?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                </IonRow>
                                {(match.result !== null) && <IonRow>
                                    <IonCol size="12">
                                        {match.result === 0 && <IonText className="result_blue-side-won">{t('judge.blue_side_wins')}{(match.match_time > 0) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 1 && <IonText className="result_white-side-won">{t('judge.white_side_wins')}{(match.match_time > 0) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 2 && <IonText className="result_draw">{t('judge.draw')}{(match.match_time > 0) && (" • "+moment.utc(match.match_time*1000).format('mm:ss'))}</IonText>}
                                        {match.result === 3 && <IonText className="result_null">{t('judge.cancelled')}</IonText>}
                                    </IonCol>
                                </IonRow>}
                                <IonRow>
                                    <IonCol size="12">
                                        <IonButton className="share-participant-user" fill="clear" color="dark" onClick={() => shareMatch(match)}><IonIcon icon={shareIcon} style={{marginRight: "5px"}}/> {t('events.share_participant')}</IonButton>
                                    </IonCol>
                                </IonRow>
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
                            .sort((a:any, b:any) => a.cage - b.cage)
                            .map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="6" onClick={() => setShowParticipantDetails(participant)}>
                                        <span className="red-cage-number">{participant.cage}</span>
                                        <div className="user-baloteo-participant-creds">
                                            <div className="user-baloteo-participant-name">{participant.team?.name}</div>
                                            <div className="baloteo-participant-type">{participant.type} {participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                            <div className="baloteo-participant-type">{getParticipantBettingAmount(participant, event)}</div>
                                            <div className="baloteo-participant-type">{(participant.participated_before) ? t('events.experienced_participant') : t('events.not_experienced_participant')}</div>
                                            {(participant.status === "approved") && <div className="baloteo-participant-status green">{participant.status}</div>}
                                            {(participant.status === "rejected") && <div className="baloteo-participant-status red">{participant.status}</div>}
                                        </div>
                                    </IonCol>
                                    <IonCol size="6" style={{textAlign: "right"}}>
                                        {participant.image && <>
                                            <IonImg
                                                src={getImageUrl(participant.image)}
                                                className={participant.image_flipped ? "participant-thumb-user baloteo" : "participant-thumb-user baloteo flipped"}
                                                onClick={() => viewParticipantImage(participant)}
                                            />
                                        </>}
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="12">
                                        <IonButton className="share-participant-user" fill="clear" color="dark" onClick={() => shareParticipant(participant)}><IonIcon icon={shareIcon} style={{marginRight: "5px"}}/> {t('events.share_participant')}</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>)}
                    </IonList>}
                </div>}

                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvent(e.detail.complete)}><IonRefresherContent /></IonRefresher>

                <Gallery
                    title={title}
                    showModal={showFullscreen}
                    setShowModal={setShowFullscreen}
                    images={[image]}
                />

                <ParticipantGallery
                    participant={selectedGalleryParticipant}
                    showModal={showGalleryImage}
                    setShowModal={setShowGalleryImage}
                    eventPhase={event.phase}
                />
                <div style={showShare ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareEventImage event={event} close={() => setShowShare(false)}  ref={shareRef} />
                </div>
                <div style={showShareMatch ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareMatchImage event={event} match={showShareMatch} close={() => setShowShareMatch(false)} ref={shareMatchRef} />
                </div>
                <div style={showShareParticipant ? {opacity: 1, transform: "translateX(100%)", width: "900px", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareParticipantImage participant={showShareParticipant} close={() => setShowShareParticipant(false)} ref={shareParticipantRef} />
                </div>
                <IonModal isOpen={!!showParticipantDetails} onDidDismiss={() => setShowParticipantDetails(false)}>
                    <ParticipantDetails participant={showParticipantDetails} event={event} close={() => setShowParticipantDetails(false)} />
                </IonModal>
                <IonModal isOpen={!!showCompareMatch} onDidDismiss={() => setShowCompareMatch(false)}>
                    <CompareMatch match={showCompareMatch} event={event} close={() => setShowCompareMatch(false)} />
                </IonModal>
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
