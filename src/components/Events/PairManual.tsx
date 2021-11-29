import {IonButton, IonGrid, IonCol, IonImg, IonRow, IonSearchbar, IonList} from "@ionic/react";
import {getImageUrl, formatOzToLbsOz} from "../utils";
import {IonText} from '@ionic/react';
import React, {useState} from "react";
import {createMatch} from "../../api/Events";

import './PairManual.css';

type PairManualProps = {
    participantId: string|false;
    opponents: any[];
    fightNumber: number;
    close: () => void;
    fetchEvent: () => void;
};

const PairManual: React.FC<PairManualProps> = ({participantId, opponents, fightNumber, close, fetchEvent}) => {
    const participant = opponents?.find(o => o.id === participantId);
    const [opponent, setOpponent] = useState<any>(false);
    const [searchOpponent, setSearchOpponent] = useState<string>("");

    const filteredOpponents = opponents?.filter(o => o.id !== participantId && (!searchOpponent || +o.cage === +searchOpponent));

    const pairMatch = async () => {
        if (participantId) {
            const response = await createMatch(opponent.event_id, participantId, opponent.id, true);
            if (response) fetchEvent();
        }
        close();
    };

    return (<><IonGrid className="pair-manual">
        <IonRow className="pair-match">
            <IonCol size="5">
                <IonImg className={participant?.image_flipped ? "baloteo-match-image flipped" : "baloteo-match-image"} src={getImageUrl(participant?.image)} />
                <p className="baloteo-match-team_name">{participant?.team?.name}</p>
            </IonCol>
            <IonCol size="2">
                <p className="baloteo-match-fight">Pelea {fightNumber}</p>
                <p className="baloteo-match-vs">VS</p>
            </IonCol>
            <IonCol size="5">
                {opponent.id ? <>
                    <IonImg className={opponent?.image_flipped ? "baloteo-match-image" : "baloteo-match-image flipped"} src={getImageUrl(opponent?.image)} />
                    <p className="baloteo-match-team_name">{opponent?.team?.name}</p>
                </> : <IonText className="animal">Animal</IonText>}
            </IonCol>
        </IonRow>
        <IonRow>
            <IonCol size="12">
                <IonText className="select-pair-text">Select animal to be paired with</IonText>
            </IonCol>
        </IonRow>
        <IonSearchbar className="searchbar" inputmode="numeric" placeholder="Search cage number" value={searchOpponent} onIonChange={e => {setSearchOpponent(e.detail.value!)}} />

        {filteredOpponents?.length > 0 && <IonList>
            {filteredOpponents.map((participant:any) => <IonRow className={opponent?.id === participant.id ? "participant manual-opponent selected" : "participant manual-opponent"} key={participant.id} onClick={() => setOpponent(participant)}>

                        <IonCol size="1">{participant.cage}</IonCol>
                        <IonCol size="6">
                            <IonImg src={getImageUrl(participant.image)} className={participant.image_flipped ? "participant-thumb flipped" : "participant-thumb"} />
                            <IonText className="baloteo-participant-name">{participant.team?.name}</IonText>
                        </IonCol>
                        <IonCol size="3" className="participant-weight-class">
                            <div>{participant.type}</div>
                            <div>{participant.weight && formatOzToLbsOz(participant.weight)}</div>
                        </IonCol>
            </IonRow>)}
        </IonList>}
    </IonGrid><IonButton expand="block" disabled={!participant?.id || !opponent?.id} className="create-match" onClick={pairMatch}>Create Match</IonButton></>);
};

export default PairManual;
