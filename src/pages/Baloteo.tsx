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
    IonImg,
    IonButton, IonGrid, IonIcon, useIonActionSheet, IonList, IonItem, IonModal,
} from '@ionic/react';
import React, {useEffect, useRef, useState} from "react";
import {getEvent, publishMatch, swapSides, announceEvent, deleteMatch} from "../api/Events";

import './Baloteo.css';
import {useHistory, useParams} from "react-router-dom";
import {getImageUrl, formatOzToLbsOz} from "../components/utils";
import {closeOutline as closeIcon, ellipsisHorizontal as menuIcon} from "ionicons/icons";
import ConfirmPrompt from "../components/ConfirmPrompt";
import PairManual from "../components/Events/PairManual";
import PrintModal from "../components/Events/PrintModal";
import ShareMatchImage from "../components/Events/ShareMatchImage";
import {useReactToPrint} from "react-to-print";
import PrintMatch from '../components/Events/PrintMatch';

const Baloteo: React.FC = () => {
    const [event, setEvent] = useState<any>([]);
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [baloteoTab, setBaloteoTab] = useState<string>("live");
    const [showAnnouncePrompt, setShowAnnouncePrompt] = useState<boolean>(false);
    const [showPairModal, setShowPairModal] = useState<string|false>(false);
    const [showShareMatch, setShowShareMatch] = useState<any>(false);
    const [selectPrintMatch, setSelectPrintMatch] = useState<any>(false);
    const { id } = useParams<{id:string}>();
    const [present, dismiss] = useIonActionSheet();
    const history = useHistory();
    const printWrapperRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => printWrapperRef.current,
        copyStyles: false
    });

    useEffect(() => {
        fetchEvent();
    }, []);

    const fetchEvent = async () => {
        const response = await getEvent(id);
        if (response.event) {
            if (response.event.phase !== "arrangement") history.replace('/baloteo_stats/'+response.event.id);
            setEvent(response.event);
        }
    };

    const matches = (event && baloteoSearch) ? event.matches?.filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name === baloteoSearch || m.opponent?.team?.name === baloteoSearch) : event.matches;
    const liveMatches = matches?.filter((p:any) => p.live) || [];
    const availableMatches = matches?.filter((p:any) => !p.live) || [];
    const unmatchedParticipants = event.participants?.filter((participant:any) =>
        participant.status === "approved" && !event.matches?.find((match:any) =>
            match.participant_id === participant.id || match.opponent_id === participant.id
        )
    ).sort((a:any, b:any) => (+a.weight - +b.weight));
    const excludedParticipants = event.participants?.filter((participant:any) => participant.status === "rejected");

    const shareMatch = async (match:any) => {
        setShowShareMatch(match);
    };

    const printMatch = async (match:any) => {
        setSelectPrintMatch(match);
        if (handlePrint) handlePrint();
    };

    const switchSides = async (matchId:string) => {
        const response = await swapSides(matchId);
        if (response.event) {
            setEvent(response.event);
        }
    };

    const addToLive = async (matchId:string) => {
        await publishMatch(matchId);
        fetchEvent();
    };

    const Announce = async () => {
        setShowAnnouncePrompt(false);
        await announceEvent(event.id);
        history.replace('/baloteo_stats/'+event.id);
    };

    const unpairMatch = async (matchId:string) => {
        await deleteMatch(matchId);
        fetchEvent();
    };

    return !event ? null : (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events"/>
                    </IonButtons>
                    <IonTitle className="page-title">
                        <p>{event.title || event.stadium_name}</p>
                        <p className="page-subtitle">{event.phase}</p>
                    </IonTitle>
                    <IonButtons slot="end">
                        <PrintModal event={event}/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonSegment className="events-tabs baloteo-tabs" scrollable value={baloteoTab} onIonChange={(e) => {setBaloteoTab(e.detail.value!);}}>
                    <IonSegmentButton value="live">
                        <IonLabel>Live Matches<span className="barely-visible"> • {liveMatches?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="available">
                        <IonLabel>Available Matches<span className="barely-visible"> • {availableMatches?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="unmatched">
                        <IonLabel>Unmatched<span className="barely-visible"> • {unmatchedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="excluded">
                        <IonLabel>Excluded<span className="barely-visible"> • {excludedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <IonSearchbar className="searchbar" placeholder="Search cage number or team name" value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                {(baloteoTab === "live") && <div className="baloteo-matches">
                    <IonGrid className="baloteo-match">
                        <IonRow className="baloteo-side-header">
                            <IonCol size="5">
                                <div className="blue_side">
                                    <div className="baloteo-match-blue_side">Blue Side</div>
                                </div>
                            </IonCol>
                            <IonCol size="2" />
                            <IonCol size="5">
                                <div className="white_side">
                                    <div className="baloteo-match-white_side">White Side</div>
                                </div>
                            </IonCol>
                        </IonRow>
                        {liveMatches.map((match:any, index:number) => (<IonGrid className="baloteo-match-wrapper">
                                <IonRow>
                                    <IonCol size="2" offset="10">
                                        <IonButton fill="clear" color="dark" className="printMenu" onClick={() => present({
                                            buttons: [
                                                { text: 'Share this match', handler: () => shareMatch(match) },
                                                { text: 'Print this match', handler: () => printMatch(match) },
                                                match.manual && { text: 'Unmatch', handler: () => unpairMatch(match.id) },
                                                { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ],
                                            header: 'Settings'
                                        })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="5">
                                        <div className="blue_side" onClick={() => switchSides(match.id)}>
                                            <IonImg className={(match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image") + (!match.participant?.image && " placeholder_rooster")} src={getImageUrl(match.participant?.image)} />
                                            <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">Pelea {index + 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                        {match.manual && <p className="baloteo-match-manual">Manual</p>}
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className="white_side" onClick={() => switchSides(match.id)}>
                                            <IonImg className={(match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped")  + (!match.participant?.image && " placeholder_rooster")} src={getImageUrl(match.opponent?.image)} />
                                            <p className="baloteo-match-team_name">{match.opponent?.team?.name}</p>
                                        </div>
                                    </IonCol>
                                </IonRow>

                        </IonGrid>))}</IonGrid></div>}
                {(baloteoTab === "available") && <div className="baloteo-matches">
                    {availableMatches.map((match:any, index:number) => (
                        <IonGrid key={index} className="baloteo-match">
                            <IonGrid className="baloteo-match-wrapper">
                                <IonRow>
                                    <IonCol size="2" offset="10">
                                        <IonButton fill="clear" color="dark" className="printMenu" onClick={() => present({
                                            buttons: [
                                                { text: 'Share this match', handler: () => printMatch(match) },
                                                { text: 'Cancel', handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ],
                                            header: 'Settings'
                                        })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="5">
                                        <IonImg className={(match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image")  + (!match.participant?.image && " placeholder_rooster")} src={getImageUrl(match.participant?.image)} />
                                        <p className="baloteo-match-team_name">{match.participant?.team?.name}</p>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">Pelea {index + 1}</p>
                                        <p className="baloteo-match-vs">VS</p>
                                    </IonCol>
                                    <IonCol size="5">
                                        <IonImg className={(match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped")  + (!match.participant?.image && " placeholder_rooster")} src={getImageUrl(match.opponent?.image)} />
                                        <p className="baloteo-match-team_name">{match.opponent?.team?.name}</p>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="12">
                                        <IonButton fill="clear" className="baloteo-manual-live" onClick={() => addToLive(match.id)}>Add to Live</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonGrid>
                    ))}</div>}
                    {(baloteoTab === "unmatched") && <div className="baloteo-participants">
                        {unmatchedParticipants?.length > 0 && <IonList>
                            {unmatchedParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="1">{participant.cage}</IonCol>
                                        <IonCol size="6">
                                            <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"} />
                                            <div className="baloteo-participant-creds">
                                                <div className="baloteo-participant-name">{participant.team?.name}</div>
                                                <div className="baloteo-participant-type">{participant.type}</div>
                                                <div className="baloteo-participant-type">{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                            </div>
                                        </IonCol>
                                        <IonCol size="3">
                                            <IonButton fill="clear" className="pair-button" onClick={() => setShowPairModal(participant.id)}>Pair</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItem>)}
                        </IonList>}
                    </div>}
                    {(baloteoTab === "excluded") && <div className="baloteo-participants">
                        {excludedParticipants?.length > 0 && <IonList>
                            {excludedParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="1">{participant.cage}</IonCol>
                                        <IonCol size="6">
                                            <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"} />
                                            <div className="baloteo-participant-creds">
                                                <div className="baloteo-participant-name">{participant.team?.name}</div>
                                                <div className="baloteo-participant-type">{participant.type}</div>
                                                <div className="baloteo-participant-type">{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItem>)}
                        </IonList>}
                    </div>}
                    <div className="baloteo-announce">
                        <IonButton expand="block" disabled={!liveMatches.length} onClick={() => setShowAnnouncePrompt(true)}>Announce</IonButton>
                    </div>
                    <ConfirmPrompt
                        show={showAnnouncePrompt}
                        title="Announce Matches"
                        subtitle="Are you sure you want to announce matches? You can't change participant sides after you announce them."
                        onResult={(data, isConfirmed) => isConfirmed ? Announce() : setShowAnnouncePrompt(false)}
                    />
                <IonModal isOpen={!!showPairModal} onDidDismiss={() => setShowPairModal(false)}>
                    <IonToolbar className="modal-header">
                        <IonButtons slot="start" className="pair-manual-close"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => setShowPairModal(false)} /></IonButtons>
                        <IonTitle className="page-title">Pair Animal</IonTitle>
                    </IonToolbar>
                    <PairManual
                        participantId={showPairModal}
                        opponents={unmatchedParticipants}
                        fightNumber={liveMatches.length + availableMatches.length + 1}
                        fetchEvent={fetchEvent}
                        close={() => {setShowPairModal(false); setBaloteoTab("live")}}
                    />
                </IonModal>
                <IonModal isOpen={!!showShareMatch} onDidDismiss={() => setShowShareMatch(false)}>
                    <ShareMatchImage match={showShareMatch} close={() => setShowShareMatch(false)} />
                </IonModal>
                <div style={{ overflow: "hidden", height: 0, width: 0 }}><PrintMatch ref={printWrapperRef} event={event} match={selectPrintMatch} /></div>
                </IonContent>
        </IonPage>
    );
};

export default Baloteo;
