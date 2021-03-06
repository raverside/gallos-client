import {
    IonContent,
    IonPage,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonRow,
    IonCol,
    IonButton,
    IonGrid,
    IonIcon,
    IonList,
    IonItem,
    IonLoading, IonSearchbar, IonModal,
} from '@ionic/react';
import React, {useState} from "react";

import {getImageUrl, formatOzToLbsOz} from "../utils";
import {closeOutline as closeIcon} from "ionicons/icons";
import {updateMatchParticipant} from "../../api/Events";

import {useTranslation} from "react-multi-lang";
import PairManual from "./PairManual";

const PairBothManual: React.FC<any> = ({event, blueSide, match, fetchEvent, close}) => {
    const t = useTranslation();
    const [baloteoSearch, setBaloteoSearch] = useState<string>("");
    const [showPairModal, setShowPairModal] = useState<string|false>(false);

    const unmatchedParticipants = event.participants?.filter((participant:any) =>
        participant.status === "approved" && !event.matches?.find((match:any) =>
        match.participant_id === participant.id || match.opponent_id === participant.id
        )
    )
        .filter((p:any) => +p?.cage === +baloteoSearch || p.team?.name?.toLowerCase().includes(baloteoSearch.toLowerCase()) || !baloteoSearch)
        .sort((a:any, b:any) => (+a.weight - +b.weight));

    return !event?.id ? <IonLoading isOpen={true} spinner="crescent" /> : (
        <IonPage>
            <IonToolbar className="modal-header">
                <IonButtons slot="start" className="pair-manual-close"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => close()} /></IonButtons>
                <IonTitle className="page-title">#{match?.number} {blueSide ? t('baloteo.blue_side') : t('baloteo.white_side')}</IonTitle>
            </IonToolbar>

            <IonContent fullscreen>
                <IonSearchbar className="searchbar" placeholder={t('baloteo.search')} value={baloteoSearch} onIonChange={e => {setBaloteoSearch(e.detail.value!)}} />
                <div className="baloteo-participants">
                    {unmatchedParticipants?.length > 0 && <IonList>
                        {unmatchedParticipants.map((participant:any) => <IonItem className="participant" lines="none" key={participant.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="2">{participant.cage}</IonCol>
                                    <IonCol size="8">
                                        <img
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
                                        <IonButton fill="clear" className="pair-button" onClick={() => setShowPairModal(participant.id)}>{t('baloteo.pick')}</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>)}
                    </IonList>}
                </div>
                <IonModal isOpen={!!showPairModal} onDidDismiss={() => setShowPairModal(false)}>
                    <IonToolbar className="modal-header">
                        <IonButtons slot="start" className="pair-manual-close"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => setShowPairModal(false)} /></IonButtons>
                        <IonTitle className="page-title">{t('baloteo.pair_animal')}</IonTitle>
                    </IonToolbar>
                    <PairManual
                        participantId={showPairModal}
                        opponents={unmatchedParticipants}
                        fightNumber={match?.number}
                        existingMatch={match?.id}
                        fetchEvent={fetchEvent}
                        close={() => {setShowPairModal(false); close()}}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default PairBothManual;
