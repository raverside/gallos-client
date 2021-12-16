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
    IonImg, IonGrid, IonList, IonItem,
    IonCard, IonIcon, IonModal
} from '@ionic/react';
import React, {useEffect, useState} from "react";
import {getEvent} from "../api/Events";

import './Baloteo.css';
import {useParams} from "react-router-dom";
import {getImageUrl, formatOzToLbsOz} from "../components/utils";
import {useTranslation} from "react-multi-lang";
import {printOutline as printIcon} from "ionicons/icons";
import PrintModal from "../components/Events/PrintModal";
import ParticipantGallery from "../components/Events/ParticipantGallery";
import ParticipantPhotoUploader from "../components/Events/ParticipantPhotoUploader";

const BaloteoStats: React.FC = () => {
    const t = useTranslation();
    const [event, setEvent] = useState<any>([]);
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [baloteoTab, setBaloteoTab] = useState<string>("matches");
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [selectedGalleryParticipant, setSelectedGalleryParticipant] = useState<any>(false);
    const [showParticipantPhotoUploader, setShowParticipantPhotoUploader] = useState<boolean>(false);
    const [showGalleryImage, setShowGalleryImage] = useState<boolean>(false);
    const { id } = useParams<{id:string}>();

    useEffect(() => {
        fetchEvent();
    }, []);

    const fetchEvent = async () => {
        const response = await getEvent(id);
        if (response.event) {
            setEvent(response.event);
        }
    };

    const viewParticipantImage = (participant:any) => {
        setSelectedGalleryParticipant(participant);
        setShowGalleryImage(true);
    }

    const showPhotoUploader = (participant:any) => {
        setSelectedParticipant(participant);
        setShowParticipantPhotoUploader(true);
    }

    const matches = (event && baloteoSearch) ? event.matches?.filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name === baloteoSearch || m.opponent?.team?.name === baloteoSearch) : event?.matches;
    const liveMatches = matches?.filter((p:any) => p.live) || [];

    return !event ? null : (
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
                <IonSegment value={baloteoTab} onIonChange={(e) => setBaloteoTab(e.detail.value!)} className="user-profile-tabs-segment">
                    <IonSegmentButton value="matches"><IonLabel>{t('baloteo.tab_matches')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="results"><IonLabel>{t('baloteo.tab_results')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton disabled value="statistics"><IonLabel>{t('baloteo.tab_statistics')}</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="animals"><IonLabel>{t('baloteo.tab_animals')}</IonLabel></IonSegmentButton>
                </IonSegment>
                {(baloteoTab === "matches") && <div className="baloteo-matches">
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
                        {liveMatches.map((match:any, index:number) => (

                                <IonRow className="baloteo-match-wrapper">
                                    <IonCol size="5">
                                        <div className="blue_side">
                                            <IonImg
                                                onClick={() => viewParticipantImage(match.participant)}
                                                className={match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image"}
                                                src={getImageUrl(match.participant?.image)} />
                                            <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {index + 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                        {match.manual && <p className="baloteo-match-manual">{t('baloteo.manual')}</p>}
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className="white_side">
                                            <IonImg
                                                onClick={() => viewParticipantImage(match.opponent)}
                                                className={match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped"}
                                                src={getImageUrl(match.opponent?.image)} />
                                            <p className="baloteo-match-team_name">{match.opponent?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                </IonRow>
                        ))}
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
                                    <IonCol size="1">{participant.cage}</IonCol>
                                    <IonCol size="6">
                                        {participant.image && <IonImg
                                            src={getImageUrl(participant.image)}
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
                </IonContent>
        </IonPage>
    );
};

export default BaloteoStats;
