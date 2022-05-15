import {
    IonContent,
    IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSearchbar,
    IonList,
    IonItem,
    IonImg,
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonTitle,
    IonIcon,
    IonLoading,
    useIonActionSheet,
    IonRefresherContent, IonRefresher
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import {getEvent, removeParticipant} from "../api/Events";

import './EventReceiving.css';
import {AppContext} from "../State";
import {useHistory, useParams} from "react-router-dom";
import CreateParticipantButton from "../components/Events/CreateParticipantButton";
import ParticipantEditor from "../components/Events/ParticipantEditor";
import ParticipantPhotoUploader from "../components/Events/ParticipantPhotoUploader";
import Matchmaking from "../components/Events/Matchmaking";
import editIcon from "../img/edit.png";
import {cameraReverseOutline as addPhotoIcon, ellipsisHorizontal as menuIcon, rocketOutline as expressInactive, rocket as expressActive, trashOutline as deleteIcon} from 'ionicons/icons';
import {getImageUrl, formatOzToLbsOz} from "../components/utils";
import ConfirmPrompt from "../components/ConfirmPrompt";
import {useTranslation} from "react-multi-lang";
import PrintModal from "../components/Events/PrintModal";
import ParticipantGallery from "../components/Events/ParticipantGallery";
import EventPhaseManagement from "../components/Events/PhaseManagement";

const EventReceiving: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>([]);
    const [participantsSearch, setParticipantsSearch] = useState<string>("");
    const [participantsTab, setParticipantsTab] = useState<string>("saved");
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [selectedGalleryParticipant, setSelectedGalleryParticipant] = useState<any>(false);
    const [showParticipantEditor, setShowParticipantEditor] = useState<boolean>(false);
    const [showParticipantPhotoUploader, setShowParticipantPhotoUploader] = useState<boolean>(false);
    const [showConfirmPhotoless, setShowConfirmPhotoless] = useState<boolean>(false);
    const [showDeleteParticipant, setShowDeleteParticipant] = useState<any>(false);
    const [showMatchmaking, setShowMatchmaking] = useState<boolean>(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const { id } = useParams<{id:string}>();
    const [present, dismiss] = useIonActionSheet();
    const history = useHistory();
    const [showGalleryImage, setShowGalleryImage] = useState<boolean>(false);
    const [expressMode, setExpressMode] = useState<boolean>(false);

    useEffect(() => {
        fetchEvent();
    }, []);

    useEffect(() => {
        const phase = ((state.user.role === "admin" || state.user.role === "admin_manager" || state.user.role === "stadium_admin_worker") && event.admin_phase) ? event.admin_phase : event.phase;
        switch (phase) {
            case "on going":
            case "complete":
                history.replace('/baloteo_stats/'+event?.id);
                break;
            case "arrangement":
                history.replace('/baloteo/'+event?.id);
                break;
        }
    }, [event?.phase, event?.admin_phase]);

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

    const deleteParticipant = async (participant:any) => {
        if (!participant) return false;
        await removeParticipant(participant.id);
        fetchEvent();
    }

    const participants = participantsSearch ? event.participants?.filter((p:any) =>
        p.cage === +participantsSearch ||
        p.team?.name?.toLowerCase().includes(participantsSearch.toLowerCase()) ||
        p.team?.digital_id === +participantsSearch ||
        p.owner_account_number === +participantsSearch
    ) : event.participants;
    const savedParticipants = participants?.filter((p:any) => p.status === 'saved');
    const approvedParticipants = participants?.filter((p:any) => p.status === 'approved');
    const excludedParticipants = participants?.filter((p:any) => p.status === 'rejected');
    const currentTabParticipants = participants?.sort((a:any, b:any) => +(b.image===null) - +(a.image===null) || b.cage - a.cage).filter((p:any) => p.status === participantsTab);

    const toggleExpressMode = () => {
        setExpressMode((currentExpressMode) => {
            const newExpressMode = !currentExpressMode;
            if (newExpressMode) {
                const nextParticipant = (currentTabParticipants[currentTabParticipants.length - 1]) ? currentTabParticipants[currentTabParticipants.length - 1] : (participants.length > 0) ? participants.sort((a:any, b:any) => +(b.image===null) - +(a.image===null) || b.cage - a.cage)[participants.length - 1] : false;
                setSelectedParticipant(nextParticipant);
                setShowParticipantEditor(!!nextParticipant);
            }
            return newExpressMode;
        });
    }

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
                        <IonButton fill="clear" color={expressMode ? "primary" : "dark"} className="express-mode" onClick={toggleExpressMode}><IonIcon size="large" icon={expressMode ? expressActive : expressInactive}/></IonButton>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill="clear" color="dark" slot="end" className="view-note-menu" onClick={() => present({
                            buttons: [
                                { text: t('events.print'), handler: () => setShowPrintModal(true)},
                                (approvedParticipants?.length > 0) ? { text: 'VS', handler: () => (participants.filter((p:any) => !p.image).length > 0) ? setShowConfirmPhotoless(true) : setShowMatchmaking(true)} : {},
                            ],
                            header: t('events.settings')
                        })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                        <PrintModal event={event} showModal={showPrintModal} setShowModal={setShowPrintModal} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {((state.user.role === "admin" || state.user.role === "admin_manager" || state.user.role === "stadium_admin_worker") && event) && <EventPhaseManagement event={event} setEvent={setEvent}/>}
                <IonSegment className="events-tabs" value={(participantsTab === "rejected" || participantsTab === "approved") ? participantsTab : "saved"} onIonChange={(e) => {setParticipantsTab(e.detail.value!);}}>
                    <IonSegmentButton value="saved">
                        <IonLabel>{t('events.saved')}<span className="barely-visible"> • {savedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="approved">
                        <IonLabel>{t('events.approved')}<span className="barely-visible"> • {approvedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="rejected">
                        <IonLabel>{t('events.excluded')}<span className="barely-visible"> • {excludedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <IonSearchbar className="searchbar" inputmode="numeric" placeholder={t('events.search')} value={participantsSearch} onIonChange={e => {setParticipantsSearch(e.detail.value!)}} />

                {currentTabParticipants?.length > 0 && <IonList className="participants-list">
                    {currentTabParticipants.map((participant:any) => <IonItem className={participant.deleted ? "participant deleted_participant" : "participant"} lines="none" key={participant.id}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">{participant.cage}</IonCol>
                                <IonCol size="6" style={{display: "flex", alignItems: "center"}}>
                                    {participant.image && <img
                                        src={getImageUrl("thumb_"+participant.image)}
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src=getImageUrl(participant.image);
                                        }}
                                        onClick={() => viewParticipantImage(participant)}
                                        className={participant.image_flipped ? "participant-thumb flipped" : "participant-thumb"}
                                    />}
                                    {!participant.image && <IonButton className="participant-placeholder" fill="clear" onClick={() => {showPhotoUploader(participant)}}><IonIcon icon={addPhotoIcon} slot="icon-only" /></IonButton>}
                                    <IonText>{participant.deleted ? t('events.deleted_participant') : participant.team?.name}</IonText>
                                </IonCol>
                                <IonCol size="2" className="participant-weight-class">
                                    <div>{participant.type}</div>
                                    {participant.owner_account_number && <IonText color="primary">ID: {(""+participant.owner_account_number).substr(0, 3)+"-"+(""+participant.owner_account_number).substr(3, 3)}</IonText>}
                                    <div>{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                </IonCol>
                                <IonCol size="2">
                                    <IonButton className="participant-edit" fill="clear" onClick={() => {setSelectedParticipant(participant); setShowParticipantEditor(true);}}>
                                        <IonImg src={editIcon} />
                                    </IonButton>
                                    <IonButton className="participant-edit" fill="clear" color={participant.deleted ? "primary" : "dark"} onClick={() => {setShowDeleteParticipant(participant);}}>
                                        <IonIcon icon={deleteIcon} />
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>)}
                </IonList>}

                <CreateParticipantButton showParticipantEditor={() => {setSelectedParticipant(false); setShowParticipantEditor(true)}}/>
                <IonModal isOpen={!!showParticipantEditor} onDidDismiss={() => setShowParticipantEditor(false)}>
                    <ParticipantEditor
                        close={() => {setShowParticipantEditor(false); setSelectedParticipant(false);}}
                        expressMode={expressMode}
                        expressNext={() => {
                                const currentParticipantIndex = currentTabParticipants.findIndex((ctp:any) => ctp.id === selectedParticipant?.id);
                                const nextParticipant = (currentParticipantIndex > 0 && currentTabParticipants[currentParticipantIndex - 1]) ? currentTabParticipants[currentParticipantIndex - 1] : false;
                                setSelectedParticipant(nextParticipant);
                                !nextParticipant && setShowParticipantEditor(false);
                        }}
                        event={event}
                        fetchEvent={fetchEvent}
                        participant={selectedParticipant}
                        findParticipantByCage={(cageNumber) => {
                            if (cageNumber) {
                                const foundParticipant = participants.find((p:any) => p.cage === cageNumber);
                                if (foundParticipant) {
                                    setSelectedParticipant(foundParticipant);
                                    return true;
                                }
                            }
                            return false;
                        }}
                    />
                </IonModal>
                <IonModal isOpen={!!showParticipantPhotoUploader} onDidDismiss={() => setShowParticipantPhotoUploader(false)}>
                    <ParticipantPhotoUploader
                        close={() => setShowParticipantPhotoUploader(false)}
                        event={event}
                        fetchEvent={fetchEvent}
                        participant={selectedParticipant}
                    />
                </IonModal>
                <Matchmaking event={event} show={showMatchmaking} setShow={setShowMatchmaking} />
                <ConfirmPrompt
                    data={showConfirmPhotoless}
                    show={!!showConfirmPhotoless}
                    title={t('events.confirm_matchmaking_title')}
                    subtitle={t('events.confirm_matchmaking_subtitle')}
                    onResult={(data, isConfirmed) => {isConfirmed && setShowMatchmaking(true); setShowConfirmPhotoless(false)}}
                />
                <ConfirmPrompt
                    data={showDeleteParticipant}
                    show={!!showDeleteParticipant}
                    title={t('events.delete_participant')}
                    subtitle={t('events.delete_participant_confirm')}
                    onResult={(data, isConfirmed) => {isConfirmed && deleteParticipant(data); setShowDeleteParticipant(false)}}
                />
                <ParticipantGallery
                    participant={selectedGalleryParticipant}
                    showModal={showGalleryImage}
                    setShowModal={setShowGalleryImage}
                    showPhotoUploader={showPhotoUploader}
                    eventPhase={event.admin_phase || event.phase}
                />
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchEvent(e.detail.complete)}><IonRefresherContent /></IonRefresher>
            </IonContent>
        </IonPage>
    );
};

export default EventReceiving;
