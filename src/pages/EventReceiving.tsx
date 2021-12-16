import {
    IonContent,
    IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel, IonSearchbar,
    IonList, IonItem, IonImg, IonButton, IonText,
    IonGrid, IonRow, IonCol, IonToolbar, IonButtons, IonBackButton, IonHeader, IonTitle, IonIcon, useIonActionSheet
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import {getEvent} from "../api/Events";

import './EventReceiving.css';
import {AppContext} from "../State";
import {useParams} from "react-router-dom";
import CreateParticipantButton from "../components/Events/CreateParticipantButton";
import ParticipantEditor from "../components/Events/ParticipantEditor";
import ParticipantPhotoUploader from "../components/Events/ParticipantPhotoUploader";
import Matchmaking from "../components/Events/Matchmaking";
import editIcon from "../img/edit.png";
import versusIcon from "../img/versus.png";
import {cameraReverseOutline as addPhotoIcon, ellipsisHorizontal as menuIcon} from 'ionicons/icons';
import {getImageUrl, formatOzToLbsOz} from "../components/utils";
import ConfirmPrompt from "../components/ConfirmPrompt";
import {useTranslation} from "react-multi-lang";
import PrintModal from "../components/Events/PrintModal";

const EventReceiving: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>([]);
    const [participantsSearch, setParticipantsSearch] = useState<string>("");
    const [participantsTab, setParticipantsTab] = useState<string>("saved");
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [showParticipantEditor, setShowParticipantEditor] = useState<boolean>(false);
    const [showParticipantPhotoUploader, setShowParticipantPhotoUploader] = useState<boolean>(false);
    const [showConfirmPhotoless, setShowConfirmPhotoless] = useState<boolean>(false);
    const [showMatchmaking, setShowMatchmaking] = useState<boolean>(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const { id } = useParams<{id:string}>();
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        fetchEvent();
    }, []);

    const fetchEvent = async () => {
        const response = await getEvent(id);
        if (response.event) {
            setEvent(response.event);
        }
    };

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
                    {currentTabParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="1">{participant.cage}</IonCol>
                                <IonCol size="7" style={{display: "flex", alignItems: "center"}}>
                                    {participant.image && <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb flipped" : "participant-thumb"} />}
                                    {!participant.image && <IonButton className="participant-placeholder" fill="clear" onClick={() => {setSelectedParticipant(participant); setShowParticipantPhotoUploader(true);}}><IonIcon icon={addPhotoIcon} slot="icon-only" /></IonButton>}
                                    <IonText>{participant.team?.name}</IonText>
                                </IonCol>
                                <IonCol size="2" className="participant-weight-class">
                                    <div>{participant.type}</div>
                                    <div>{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                                </IonCol>
                                <IonCol size="2">
                                    <IonButton className="participant-edit" fill="clear" onClick={() => {setSelectedParticipant(participant); setShowParticipantEditor(true);}}>
                                        <IonImg src={editIcon} />
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>)}
                </IonList>}

                <CreateParticipantButton showParticipantEditor={() => {setSelectedParticipant(false); setShowParticipantEditor(true)}}/>
                <IonModal isOpen={!!showParticipantEditor} onDidDismiss={() => setShowParticipantEditor(false)}>
                    <ParticipantEditor
                        close={() => setShowParticipantEditor(false)}
                        event={event}
                        fetchEvent={fetchEvent}
                        participant={selectedParticipant}
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
            </IonContent>
        </IonPage>
    );
};

export default EventReceiving;
