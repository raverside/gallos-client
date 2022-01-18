import {
    IonContent,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSearchbar,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonTitle,
    IonRow,
    IonCol,
    IonLoading, IonGrid, IonList, IonItem,
    IonCard, IonIcon, IonModal, IonRefresherContent, IonRefresher, IonText, IonButton
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import {getEvent} from "../api/Events";

import './Baloteo.css';
import {useHistory, useParams} from "react-router-dom";
import {getImageUrl, formatOzToLbsOz, isDesktop} from "../components/utils";
import {useTranslation} from "react-multi-lang";
import {printOutline as printIcon, shareSocialOutline as shareIcon} from "ionicons/icons";
import PrintModal from "../components/Events/PrintModal";
import ParticipantGallery from "../components/Events/ParticipantGallery";
import ParticipantPhotoUploader from "../components/Events/ParticipantPhotoUploader";
import EventPhaseManagement from "../components/Events/PhaseManagement";
import {AppContext} from "../State";
import moment from "moment";
import ShareMatchImage from "../components/Events/ShareMatchImage";

// @ts-ignore
import domtoimage from "dom-to-image-improved";

const BaloteoStats: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>([]);
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [baloteoTab, setBaloteoTab] = useState<string>("matches");
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [showShareMatch, setShowShareMatch] = useState<any>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [selectedGalleryParticipant, setSelectedGalleryParticipant] = useState<any>(false);
    const [showParticipantPhotoUploader, setShowParticipantPhotoUploader] = useState<boolean>(false);
    const [showGalleryImage, setShowGalleryImage] = useState<boolean>(false);
    const shareMatchRef = React.useRef();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const history = useHistory();
    const { id } = useParams<{id:string}>();

    useEffect(() => {
        fetchEvent();
    }, []);

    useEffect(() => {
        switch (event.phase) {
            case "receiving":
                history.replace('/event_receiving/'+event?.id);
                break;
            case "arrangement":
                history.replace('/baloteo/'+event?.id);
                break;
        }
    }, [event?.phase]);

    const fetchEvent = async (callback = () => {}) => {
        const response = await getEvent(id);
        if (response.event) {
            if (response.event.phase === "complete" && baloteoTab === "matches") {
                setBaloteoTab("results");
            }
            setEvent(response.event);
        }
        callback();
    };

    const shareMatch = async (match:any) => {
        if (!match) return false;
        setShowLoading(true);
        const element = shareMatchRef.current;
        setShowShareMatch(match);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: "image/png" });
            setShowShareMatch(false);

            if (isDesktop()) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                //share the file
                const filesArray:any = [file];
                if (navigator.canShare && navigator.canShare({files: filesArray})) {
                    navigator.share({files: filesArray});
                }
            }
            setShowLoading(false);
        });
    }

    const viewParticipantImage = (participant:any) => {
        setSelectedGalleryParticipant(participant);
        setShowGalleryImage(true);
    }

    const showPhotoUploader = (participant:any) => {
        setSelectedParticipant(participant);
        setShowParticipantPhotoUploader(true);
    }

    const matches = (event && baloteoSearch) ? event.matches?.sort((a:any, b:any) => a.number - b.number).filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name === baloteoSearch || m.opponent?.team?.name === baloteoSearch) : event?.matches?.sort((a:any, b:any) => a.number - b.number);
    const liveMatches = matches?.filter((p:any) => p.live) || [];
    const completeMatches = matches?.filter((m:any) => !m.live && m.result !== null) || [];
    const activeMatches = (baloteoTab === "results") ? completeMatches : liveMatches;

    return !event ? <IonLoading isOpen={true} spinner="crescent" /> : (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events"/>
                    </IonButtons>
                    <IonTitle className="page-title">
                        <p>{event.title || event.stadium_name}</p>
                        <p className="page-subtitle">{t('baloteo.baloteo')} {t('events.phase_'+event?.phase?.replace(' ', ''))}</p>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonIcon
                            icon={printIcon}
                            className="print-icon"
                            slot="end"
                            onClick={() => setShowPrintModal(true)}
                        />
                        <PrintModal event={event} showModal={showPrintModal} setShowModal={setShowPrintModal} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {((state.user.role === "admin" || state.user.role === "admin_manager") && event) && <EventPhaseManagement event={event} setEvent={setEvent}/>}
                <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="matches"><IonLabel>{t('baloteo.tab_matches')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled={!(completeMatches.length > 0)} value="results"><IonLabel>{t('baloteo.tab_results')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="statistics"><IonLabel>{t('baloteo.tab_statistics')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="animals"><IonLabel>{t('baloteo.tab_animals')}</IonLabel></IonSegmentButton>
                </IonSegment>
                {(baloteoTab === "matches" || baloteoTab === "results") && <div className="baloteo-matches">
                    <IonSearchbar className="searchbar" placeholder={t('baloteo.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
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
                        {activeMatches.map((match:any, index:number) => (<div className="baloteo-match-wrapper">

                                <IonRow>
                                    <IonCol size="5">
                                        <div className="blue_side">
                                            <img
                                                onClick={() => viewParticipantImage(match.participant)}
                                                className={match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image"}
                                                src={getImageUrl("thumb_"+match.participant?.image, false)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(match.participant?.image, false);
                                                }}
                                            />
                                            <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {match.number || 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                        {match.manual && <p className="baloteo-match-manual">{t('baloteo.manual')}</p>}
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className="white_side">
                                            <img
                                                onClick={() => viewParticipantImage(match.opponent)}
                                                className={match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped"}
                                                src={getImageUrl("thumb_"+match.opponent?.image, false)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(match.opponent?.image, false);
                                                }}
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
                        </div>))}
                    </IonGrid></div>}
                {(baloteoTab === "animals") && <div className="baloteo-participants">
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
                    <IonSearchbar className="searchbar" placeholder={t('baloteo.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                    {event.participants?.length > 0 && <IonList>
                        {event.participants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="2">{participant.cage}</IonCol>
                                    <IonCol size="7">
                                        {participant.image && <img
                                            src={getImageUrl("thumb_"+participant.image, false)}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src=getImageUrl(participant.image, false);
                                            }}
                                            className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"}
                                            onClick={() => viewParticipantImage(participant)}
                                        />}
                                        <div className="baloteo-participant-creds">
                                            <div className="baloteo-participant-name">{participant.team?.name}</div>
                                        </div>
                                    </IonCol>
                                    <IonCol size="3">
                                        <div className="baloteo-participant-creds">
                                            <div className="baloteo-participant-type">{participant.type}</div>
                                            <div className="baloteo-participant-type">{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>)}
                    </IonList>}
                </div>}
                <ParticipantGallery
                    participant={selectedGalleryParticipant}
                    showModal={showGalleryImage}
                    setShowModal={setShowGalleryImage}
                    showPhotoUploader={showPhotoUploader}
                    eventPhase={event.phase}
                />
                <IonModal isOpen={!!showParticipantPhotoUploader} onDidDismiss={() => setShowParticipantPhotoUploader(false)}>
                    <ParticipantPhotoUploader
                        close={() => setShowParticipantPhotoUploader(false)}
                        event={event}
                        fetchEvent={fetchEvent}
                        participant={selectedParticipant}
                    />
                </IonModal>
                <div style={showShareMatch ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareMatchImage event={event} match={showShareMatch} close={() => setShowShareMatch(false)} ref={shareMatchRef} />
                </div>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvent(e.detail.complete)}><IonRefresherContent /></IonRefresher>
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

export default BaloteoStats;
