import {
    IonContent,
    IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonLabel, IonSearchbar,
    IonList, IonItem, IonImg, IonButton, IonText,
    IonGrid, IonRow, IonCol, IonToolbar, IonButtons, IonBackButton, IonHeader, IonTitle,
} from '@ionic/react';
import React, {useContext, useEffect, useState} from "react";
import {getEvent} from "../api/Events";

import './EventReceiving.css';
import {AppContext} from "../State";
import {useParams} from "react-router-dom";
import CreateParticipantButton from "../components/Events/CreateParticipantButton";
import ParticipantEditor from "../components/Events/ParticipantEditor";
import Matchmaking from "../components/Events/Matchmaking";
import editIcon from "../img/edit.png";
import versusIcon from "../img/versus.png";
import {getImageUrl, formatOzToLbsOz} from "../components/utils";

const EventReceiving: React.FC = () => {
    const { state } = useContext(AppContext);
    const [event, setEvent] = useState<any>([]);
    const [participantsSearch, setParticipantsSearch] = useState<string>("");
    const [participantsTab, setParticipantsTab] = useState<string>("saved");
    const [selectedParticipant, setSelectedParticipant] = useState<any>(false);
    const [showParticipantEditor, setShowParticipantEditor] = useState<boolean>(false);
    const [showMatchmaking, setShowMatchmaking] = useState<boolean>(false);
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

    const participants = participantsSearch ? event.participants?.filter((p:any) => p.cage === participantsSearch) : event.participants;
    const savedParticipants = participants?.filter((p:any) => p.status === 'saved');
    const approvedParticipants = participants?.filter((p:any) => p.status === 'approved');
    const excludedParticipants = participants?.filter((p:any) => p.status === 'rejected');
    const currentTabParticipants = participants?.filter((p:any) => p.status === participantsTab);

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
                        <IonButton fill="clear" onClick={() => setShowMatchmaking(true)} disabled={!approvedParticipants?.length}><IonImg className="versus-button" src={versusIcon} /></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonSegment className="events-tabs" value={(participantsTab === "rejected" || participantsTab === "approved") ? participantsTab : "saved"} onIonChange={(e) => {setParticipantsTab(e.detail.value!);}}>
                    <IonSegmentButton value="saved">
                        <IonLabel>Saved<span className="barely-visible"> • {savedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="approved">
                        <IonLabel>Approved<span className="barely-visible"> • {approvedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="rejected">
                        <IonLabel>Excluded<span className="barely-visible"> • {excludedParticipants?.length || 0}</span></IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <IonSearchbar className="searchbar" inputmode="numeric" placeholder="Search cage number" value={participantsSearch} onIonChange={e => {setParticipantsSearch(e.detail.value!)}} />

                {currentTabParticipants?.length > 0 && <IonList>
                    {currentTabParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="1">{participant.cage}</IonCol>
                                <IonCol size="5">
                                    {participant.image && <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb flipped" : "participant-thumb"} />}
                                    <IonText>{participant.team?.name}</IonText>
                                </IonCol>
                                <IonCol size="4" className="participant-weight-class">
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
                <Matchmaking event={event} show={showMatchmaking} setShow={setShowMatchmaking} />
            </IonContent>
        </IonPage>
    );
};

export default EventReceiving;
