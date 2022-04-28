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
    IonButton,
    IonGrid,
    IonIcon,
    useIonActionSheet,
    IonList,
    IonItem,
    IonModal,
    IonRefresherContent,
    IonRefresher,
    IonLoading,
} from '@ionic/react';
import React, {useContext, useEffect, useRef, useState} from "react";
import {getEvent, publishMatch, swapSides, announceEvent, unmatch, deleteMatch} from "../api/Events";

import './Baloteo.css';
import {useHistory, useParams} from "react-router-dom";
import {getImageUrl, formatOzToLbsOz, isDesktop} from "../components/utils";
import {
    swapHorizontalOutline as switchSidesIcon,
    closeOutline as closeIcon,
    ellipsisHorizontal as menuIcon,
    printOutline as printIcon
} from "ionicons/icons";
import ConfirmPrompt from "../components/ConfirmPrompt";
import PairManual from "../components/Events/PairManual";
import PairBothManual from "../components/Events/PairBothManual";
import PrintModal from "../components/Events/PrintModal";
import ShareMatchImage from "../components/Events/ShareMatchImage";
import {useReactToPrint} from "react-to-print";
import PrintMatch from '../components/Events/PrintMatch';
import {useTranslation} from "react-multi-lang";
import EventPhaseManagement from "../components/Events/PhaseManagement";
import ParticipantGallery from "../components/Events/ParticipantGallery";
import ParticipantPhotoUploader from "../components/Events/ParticipantPhotoUploader";
import {AppContext} from "../State";

// @ts-ignore
import domtoimage from "dom-to-image-improved";

const Baloteo: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>([]);
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [baloteoTab, setBaloteoTab] = useState<string>("live");
    const [showAnnouncePrompt, setShowAnnouncePrompt] = useState<boolean>(false);
    const [showPairModal, setShowPairModal] = useState<string|false>(false);
    const [showShareMatch, setShowShareMatch] = useState<any>(false);
    const [selectPrintMatch, setSelectPrintMatch] = useState<any>(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [selectedGalleryParticipant, setSelectedGalleryParticipant] = useState<any>(false);
    const [showParticipantPhotoUploader, setShowParticipantPhotoUploader] = useState<boolean>(false);
    const [showGalleryImage, setShowGalleryImage] = useState<boolean>(false);
    const [showRematch, setShowRematch] = useState<any>(false);
    const { id } = useParams<{id:string}>();
    const [present, dismiss] = useIonActionSheet();
    const history = useHistory();
    const printWrapperRef = useRef(null);
    const shareMatchRef = React.useRef();
    const [showLoading, setShowLoading] = useState<any>(false);
    const handlePrint = useReactToPrint({
        content: () => printWrapperRef.current,
        copyStyles: false
    });

    useEffect(() => {
        fetchEvent();
    }, []);

    useEffect(() => {
        switch (event.phase) {
            case "receiving":
                history.replace('/event_receiving/'+event?.id);
                break;
            case "on going":
            case "complete":
                history.replace('/baloteo_stats/'+event?.id);
            break;
        }
    }, [event?.phase]);

    const fetchEvent = async (callback = () => {}) => {
        const response = await getEvent(id);
        if (response.event) {
            setEvent(response.event);
        }
        callback();
    };

    const viewParticipantImage = (participant:any) => {
        setSelectedGalleryParticipant(participant);
        setShowGalleryImage(true);
    }

    const showPhotoUploader = (participant:any) => {
        setSelectedParticipant(participant);
        setShowParticipantPhotoUploader(true);
    }

    const matches = (event && baloteoSearch) ? event.matches?.filter((m:any) => +m.participant?.cage === +baloteoSearch || +m.opponent?.cage === +baloteoSearch || m.participant?.team?.name?.toLowerCase().includes(baloteoSearch.toLowerCase()) || m.opponent?.team?.name?.toLowerCase().includes(baloteoSearch.toLowerCase())).sort((a:any, b:any) => a.number - b.number) : event.matches?.sort((a:any, b:any) => a.number - b.number);
    const liveMatches = matches?.filter((p:any) => p.live).sort((a:any, b:any) => a.manual - b.manual) || [];
    const availableMatches = matches?.filter((p:any) => !p.live) || [];
    const unmatchedParticipants = event.participants?.filter((participant:any) =>
        participant.status === "approved" && !event.matches?.find((match:any) =>
            match.participant_id === participant.id || match.opponent_id === participant.id
        )
    ).filter((p:any) => +p?.cage === +baloteoSearch || p.team?.name?.toLowerCase().includes(baloteoSearch.toLowerCase()) || !baloteoSearch).sort((a:any, b:any) => (+a.weight - +b.weight));
    const excludedParticipants = event.participants?.filter((participant:any) => participant.status === "rejected").filter((p:any) => +p?.cage === +baloteoSearch || p.team?.name?.toLowerCase().includes(baloteoSearch.toLowerCase()) || !baloteoSearch);

    const shareMatch = async (match:any) => {
        if (!match) return false;
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

    const printMatch = async (match:any) => {
        setSelectPrintMatch(match);
        if (handlePrint) handlePrint();
    };

    const switchSides = async (matchId:string) => {
        setEvent((currentEvent:any) => {
            const updatedMatches = currentEvent.matches.map((m:any) => {
                if (m.id === matchId) {
                    const oldOpponent = {...m.opponent};
                    const oldParticipant = {...m.participant};
                    return {...m, opponent: oldParticipant, participant: oldOpponent}
                }
                return m;
            });

            return {...currentEvent, matches: updatedMatches};
        });

        const response = await swapSides(matchId);
        if (response.event) {
            state.socket?.emit('updateEvents', {eventId: response.event.id});
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
        const response = await unmatch(matchId);
        if (response) {
            fetchEvent();
            state.socket?.emit('updateEvents');
        }
    };

    const deleteUnpairedMatch = async (matchId:string) => {
        const response = await deleteMatch(matchId);
        if (response) {
            fetchEvent();
            state.socket?.emit('updateEvents');
        }
    };

    return !event?.id ? <IonLoading isOpen={true} spinner="crescent" /> : (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events"/>
                    </IonButtons>
                    <IonTitle className="page-title">
                        <p>{event.title || event.stadium_name}</p>
                        <p className="page-subtitle">{t('events.phase_'+event?.phase?.replace(' ', ''))}</p>
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
                {((state.user.role === "admin" || state.user.role === "admin_manager" || state.user.role === "stadium_admin_worker") && event) && <EventPhaseManagement event={event} setEvent={setEvent}/>}
                <IonSegment className="events-tabs baloteo-tabs" scrollable value={baloteoTab} onIonChange={(e) => {setBaloteoTab(e.detail.value!);}}>
                    <IonSegmentButton value="live">
                        <IonLabel>{t('baloteo.tab_live')}<span className="barely-visible"> • {liveMatches?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="available">
                        <IonLabel>{t('baloteo.tab_available')}<span className="barely-visible"> • {availableMatches?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="unmatched">
                        <IonLabel>{t('baloteo.tab_unmatched')}<span className="barely-visible"> • {unmatchedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="excluded">
                        <IonLabel>{t('baloteo.tab_excluded')}<span className="barely-visible"> • {excludedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <IonSearchbar className="searchbar" placeholder={t('baloteo.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                {(baloteoTab === "live") && <><div className="baloteo-matches">
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
                        {liveMatches.map((match:any, index:number) => (<IonGrid className="baloteo-match-wrapper" key={index}>
                                <IonRow>
                                    <IonCol size="2" offset="10" style={{textAlign:"right"}}>
                                        <IonButton fill="clear" color="dark" className="printMenu" onClick={() => present({
                                            buttons: (match.participant_id && match.opponent_id) ? [
                                                { text: t('baloteo.share_match'), handler: () => shareMatch(match) },
                                                { text: t('baloteo.print_match'), handler: () => printMatch(match) },
                                                { text: t('baloteo.unmatch'), handler: () => unpairMatch(match.id) },
                                                { text: t('baloteo.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ] : [
                                                { text: t('baloteo.delete_match'), handler: () => deleteUnpairedMatch(match.id) },
                                                { text: t('baloteo.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ],
                                            header: t('baloteo.popup_header')
                                        })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="5">
                                        <div className={match.participant ? "blue_side" : "blue_side inactive"}>
                                            {match.participant ? <img
                                                onClick={() => viewParticipantImage(match.participant)}
                                                className={(match.participant?.image_flipped ? "baloteo-match-image flipped " : "baloteo-match-image") + (!match.participant?.image ? " placeholder_rooster" : "")}
                                                src={getImageUrl("thumb_"+match.participant?.image, true)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(match.participant?.image, true);
                                                }}
                                            /> : <div className="replace_participant replace_participant_blue" onClick={() => setShowRematch({match, blueSide:true})}>+</div>}
                                            <p className="baloteo-match-team_name">
                                                {match.participant ? "#"+match.participant?.cage + " " +match.participant?.team?.name : t('baloteo.blue_side')}
                                            </p>
                                        </div>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {match.number}</p>
                                        <p className={(match.participant && match.opponent) ? "baloteo-match-vs" : "baloteo-match-vs graybg"}>VS</p>
                                        {match.manual && <p className="baloteo-match-manual">{t('baloteo.manual')}</p>}
                                        {(match.opponent && match.participant) && <IonButton
                                            fill="clear"
                                            color="dark"
                                            className="switch-sides"
                                            onClick={()=>switchSides(match.id)}
                                        >
                                            <IonIcon src={switchSidesIcon} size="large"/>
                                        </IonButton>}
                                    </IonCol>
                                    <IonCol size="5">
                                        <div className={match.opponent ? "white_side" : "white_side inactive"}>
                                            {match.opponent ? <img
                                                onClick={() => viewParticipantImage(match.opponent)}
                                                className={(match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped")  + (!match.participant?.image ? " placeholder_rooster" : "")}
                                                src={getImageUrl("thumb_"+match.opponent?.image, true)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(match.opponent?.image, true);
                                                }}
                                            /> : <div className="replace_participant" onClick={() => setShowRematch({match, blueSide: false})}>+</div>}
                                            <p className="baloteo-match-team_name">
                                                {match.opponent ? "#"+match.opponent?.cage + " " +match.opponent?.team?.name : t('baloteo.white_side')}
                                            </p>
                                        </div>
                                    </IonCol>
                                </IonRow>

                        </IonGrid>))}</IonGrid></div>
                    <div className="baloteo-announce">
                        <IonButton expand="block" disabled={!liveMatches.length} onClick={() => setShowAnnouncePrompt(true)}>{t('baloteo.announce')}</IonButton>
                    </div>
                </>}
                {(baloteoTab === "available") && <div className="baloteo-matches">
                    {availableMatches.map((match:any, index:number) => (
                        <IonGrid key={index} className="baloteo-match">
                            <IonGrid className="baloteo-match-wrapper">
                                <IonRow>
                                    <IonCol size="2" offset="10">
                                        <IonButton fill="clear" color="dark" className="printMenu" onClick={() => present({
                                            buttons: (match.participant_id && match.opponent_id) ? [
                                                { text: t('baloteo.share_match'), handler: () => printMatch(match) },
                                                { text: t('baloteo.unmatch'), handler: () => unpairMatch(match.id) },
                                                { text: t('baloteo.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ] : [
                                                { text: t('baloteo.delete_match'), handler: () => deleteUnpairedMatch(match.id) },
                                                { text: t('baloteo.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                                            ],
                                            header: t('baloteo.popup_header')
                                        })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="5" className={match.participant ? "" : "inactive"}>
                                        {match.participant ? <img
                                            className={(match.participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image")  + (!match.participant?.image ? " placeholder_rooster" : "")}
                                            src={getImageUrl("thumb_"+match.participant?.image, true)}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src=getImageUrl(match.participant?.image, true);
                                            }}
                                            onClick={() => viewParticipantImage(match.participant)}
                                        /> : <div className="replace_participant replace_participant_blue" onClick={() => setShowRematch({match, blueSide: true})}>+</div>}
                                        <p className="baloteo-match-team_name">
                                            {match.participant ? "#"+match.participant?.cage + " " +match.participant?.team?.name : t('baloteo.blue_side')}
                                        </p>
                                    </IonCol>
                                    <IonCol size="2">
                                        <p className="baloteo-match-fight">{t('baloteo.fight')} {match.number}</p>
                                        <p className={(match.participant && match.opponent) ? "baloteo-match-vs" : "baloteo-match-vs graybg"}>VS</p>
                                    </IonCol>
                                    <IonCol size="5" className={match.opponent ? "" : "inactive"}>
                                        {match.opponent ? <img
                                            onClick={() => viewParticipantImage(match.opponent)}
                                            className={(match.opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped")  + (!match.participant?.image ? " placeholder_rooster" : "")}
                                            src={getImageUrl("thumb_"+match.opponent?.image, true)}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src=getImageUrl(match.opponent?.image, true);
                                            }}
                                        /> : <div className="replace_participant" onClick={() => setShowRematch({match, blueSide: false})}>+</div>}
                                        <p className="baloteo-match-team_name">
                                            {match.opponent ? "#"+match.opponent?.cage + " " +match.opponent?.team?.name : t('baloteo.white_side')}
                                        </p>
                                    </IonCol>
                                </IonRow>
                                {(match.participant && match.opponent) && <IonRow>
                                    <IonCol size="12">
                                        <IonButton fill="clear" className="baloteo-manual-live" onClick={() => addToLive(match.id)}>{t('baloteo.add_to_live')}</IonButton>
                                    </IonCol>
                                </IonRow>}
                            </IonGrid>
                        </IonGrid>
                    ))}</div>}
                    {(baloteoTab === "unmatched") && <div className="baloteo-participants">
                        {unmatchedParticipants?.length > 0 && <IonList>
                            {unmatchedParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="2">{participant.cage}</IonCol>
                                        <IonCol size="8">
                                            <img
                                                onClick={() => viewParticipantImage(participant)}
                                                src={getImageUrl("thumb_"+participant.image, true)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(participant.image, true);
                                                }}
                                                className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"}
                                            />
                                            <div className="baloteo-participant-creds">
                                                <div className="baloteo-participant-name">{participant.team?.name}</div>
                                                <div className="baloteo-participant-type">{participant.type}</div>
                                                <div className="baloteo-participant-type">{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                            </div>
                                        </IonCol>
                                        <IonCol size="2">
                                            <IonButton fill="clear" className="pair-button" onClick={() => setShowPairModal(participant.id)}>{t('baloteo.pair')}</IonButton>
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
                                            <img
                                                onClick={() => viewParticipantImage(participant)}
                                                src={getImageUrl("thumb_"+participant.image, true)}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src=getImageUrl(participant.image, true);
                                                }}
                                                className={participant.image_flipped ? "participant-thumb baloteo flipped" : "participant-thumb baloteo"}
                                            />
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
                    <ConfirmPrompt
                        show={showAnnouncePrompt}
                        title={t('baloteo.prompt_announce_title')}
                        subtitle={t('baloteo.prompt_announce_subtitle')}
                        onResult={(data, isConfirmed) => isConfirmed ? Announce() : setShowAnnouncePrompt(false)}
                    />
                <IonModal isOpen={!!showPairModal} onDidDismiss={() => setShowPairModal(false)}>
                    <IonToolbar className="modal-header">
                        <IonButtons slot="start" className="pair-manual-close"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => setShowPairModal(false)} /></IonButtons>
                        <IonTitle className="page-title">{t('baloteo.pair_animal')}</IonTitle>
                    </IonToolbar>
                    <PairManual
                        participantId={showPairModal}
                        opponents={unmatchedParticipants}
                        fightNumber={(matches && matches.length > 0) ? ((matches[matches?.length - 1]?.number) + 1) : 1}
                        fetchEvent={fetchEvent}
                        close={() => {setShowPairModal(false); setBaloteoTab("live")}}
                    />
                </IonModal>
                <IonModal isOpen={!!showRematch} onDidDismiss={() => setShowRematch(false)}>
                    <PairBothManual
                        match={showRematch.match}
                        blueSide={showRematch.blueSide}
                        event={event}
                        fetchEvent={fetchEvent}
                        rematch={(match_id:string, blueSide:boolean, participant:any) => setEvent((currentEvent:any) => {
                            const currentMatches = currentEvent.matches;
                            const currentMatchIndex = currentMatches.findIndex((x:any) => x.id === match_id);
                            if (blueSide) {
                                currentMatches[currentMatchIndex].participant = participant;
                                currentMatches[currentMatchIndex].participant_id = participant.id;
                            } else {
                                currentMatches[currentMatchIndex].opponent = participant;
                                currentMatches[currentMatchIndex].opponent_id = participant.id;
                            }
                            return {...currentEvent, matches: currentMatches};
                        })}
                        close={() => {setShowRematch(false)}}
                    />
                </IonModal>
                <div style={showShareMatch ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareMatchImage event={event} match={showShareMatch} close={() => setShowShareMatch(false)} ref={shareMatchRef} />
                </div>
                <div style={{ overflow: "hidden", height: 0, width: 0 }}><PrintMatch ref={printWrapperRef} event={event} match={selectPrintMatch} /></div>
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
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvent(e.detail.complete)}><IonRefresherContent /></IonRefresher>
                </IonContent>
        </IonPage>
    );
};

export default Baloteo;
