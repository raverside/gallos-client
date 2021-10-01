import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { closeOutline as closeIcon} from 'ionicons/icons';
import './Matchmaking.css';
import {generateMatches, goLive} from "../../api/Events";
import {getTeamOwners} from "../../api/TeamOwners";
import {useHistory} from "react-router-dom";
import SpecialGuestList from "../Events/SpecialGuestList";

type MatchmakingProps = {
    event: { id: string, phase: string };
    show: boolean;
    setShow: (show:boolean) => void;
};

const Matchmaking: React.FC<MatchmakingProps> = ({event, show, setShow}) => {
    const [method, setMethod] = useState(0); // 0 - Regular, 1 - Special Guest, 2 - Versus
    const [step, setStep] = useState(0); // 0 - Select MM Method, 1 - Regular Generated, 2 - Select Special, 3 - Select Versus
    const [matches, setMatches] = useState([]);
    const [matchesLimit, setMatchesLimit] = useState<number>(0);
    const [teamOwners, setTeamOwners] = useState<any>([]);
    const [selectedTeamOwners, setSelectedTeamOwners] = useState<any>([]);
    const [versusCategory, setVersusCategory] = useState<number>();
    const history = useHistory();

    useEffect(() => {
        if (event.id && event.phase !== "receiving") {
            history.replace("/baloteo/"+event.id);
        }
    }, [event]);

    useEffect(() => {
        fetchTeamOwners();
    }, []);

    const fetchTeamOwners = async () => {
        const response = await getTeamOwners();
        if (response.team_owners.account) {
            setTeamOwners(response.team_owners.account);
        }
    };

    const GenerateMatches = async () => {
        const response = await generateMatches(event.id, method, selectedTeamOwners);
        if (response.matches) {
            setMatches(response.matches);
        }
        setStep(1);
    };

    const GoLive = async () => {
        await goLive({event_id: event.id, matches_limit: matchesLimit, method, versus_category: versusCategory, special_guests: selectedTeamOwners});
        history.replace("/baloteo/"+event.id);
    }

    switch (step) {
        default:
            return (<IonModal isOpen={show} onDidDismiss={() => setShow(false)}>
                <IonToolbar className="modal-header">
                    <IonTitle className="page-title">Matching Method</IonTitle>
                    <IonButtons slot="start">
                        <IonIcon
                            icon={closeIcon}
                            className="matchmaking-close-icon"
                            slot="start"
                            onClick={() => setShow(false)}
                        />
                    </IonButtons>
                </IonToolbar>
                <IonContent>
                    <p className="select-matchmaking">Select Matching Method</p>
                    <IonRadioGroup value={method} onIonChange={(e) => setMethod(e.detail.value)} className="matchmaking_radio">
                        <IonItem lines="none">
                            <IonLabel>Regular</IonLabel>
                            <IonRadio className="matchmaking_radio_button" value={0} />
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel>Special Honor Guest</IonLabel>
                            <IonRadio className="matchmaking_radio_button" value={1} />
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel>Versus</IonLabel>
                            <IonRadio className="matchmaking_radio_button" value={2} />
                        </IonItem>
                    </IonRadioGroup>
                    {method === 0 ?
                        <IonButton expand="block" className="generate-button" onClick={GenerateMatches}>Generate</IonButton>
                        : <IonButton expand="block" className="generate-button" onClick={() => setStep(method === 1 ? 2 : 3)}>Next</IonButton>
                    }

                </IonContent>
            </IonModal>);
        case 1:
            return (<IonModal isOpen={show} onDidDismiss={() => setShow(false)}>
                <IonToolbar className="modal-header">
                    <IonTitle className="page-title">Matches Generated</IonTitle>
                    <IonButtons slot="start">
                        <IonIcon
                            icon={closeIcon}
                            className="matchmaking-close-icon"
                            slot="start"
                            onClick={() => setStep(0)}
                        />
                    </IonButtons>
                </IonToolbar>
                <IonContent>
                    <p className="matches-generated">{matches.length}</p>
                    <p className="matches-generated-text">Matches generated</p>
                    <p className="matches-livelimit-label">Enter number of matches you want to accept and publish</p>
                    <IonInput
                        value={matchesLimit}
                        className="matches-limit-input"
                        type="number"
                        max={""+matches.length}
                        placeholder="Number of matches"
                        onIonChange={(e) => {
                            if (+e.detail.value! > matches.length) {
                                setMatchesLimit(+matches.length);
                            } else if (+e.detail.value! <= 0) {
                                setMatchesLimit(0);
                            } else {
                                setMatchesLimit(+e.detail.value!);
                            }
                        }}
                    />

                    <IonButton expand="block" className="generate-button" disabled={!matchesLimit} onClick={GoLive}>Confirm</IonButton>
                </IonContent>
            </IonModal>);
        case 2:
            return (
                <IonModal isOpen={show} onDidDismiss={() => setShow(false)}>
                    <IonToolbar className="modal-header">
                        <IonTitle className="page-title">Select Special Guest</IonTitle>
                        <IonButtons slot="start">
                            <IonIcon
                                icon={closeIcon}
                                className="matchmaking-close-icon"
                                slot="start"
                                onClick={() => setStep(0)}
                            />
                        </IonButtons>
                    </IonToolbar>
                    <IonContent>
                        <div className="special-guest-wrapper">
                        <SpecialGuestList teamOwners={teamOwners} selectedTeamOwners={selectedTeamOwners} setSelectedTeamOwners={(selected:any) => setSelectedTeamOwners(selected)} />
                        <IonButton expand="block" disabled={!selectedTeamOwners.length} className="guests-selected-generate" onClick={GenerateMatches}>
                            <span>{selectedTeamOwners.length} selected</span>
                            <span>Generate</span>
                        </IonButton>
                        </div>
                    </IonContent>
                </IonModal>
            );
        case 3:
            return (
                <IonModal isOpen={show} onDidDismiss={() => setShow(false)}>
                    <IonToolbar className="modal-header">
                        <IonTitle className="page-title">Versus Category</IonTitle>
                        <IonButtons slot="start">
                            <IonIcon
                                icon={closeIcon}
                                className="matchmaking-close-icon"
                                slot="start"
                                onClick={() => setStep(0)}
                            />
                        </IonButtons>
                    </IonToolbar>
                    <IonContent>
                        <p className="select-matchmaking">Select versus category</p>
                        <IonRadioGroup value={versusCategory} onIonChange={(e) => setVersusCategory(e.detail.value)} className="matchmaking_radio">
                            <IonItem lines="none">
                                <IonLabel>vs Team</IonLabel>
                                <IonRadio className="matchmaking_radio_button" value={1} />
                            </IonItem>
                            <IonItem lines="none">
                                <IonLabel>vs All</IonLabel>
                                <IonRadio className="matchmaking_radio_button" value={2} />
                            </IonItem>
                        </IonRadioGroup>

                        <IonButton expand="block" disabled={!versusCategory} className="generate-button" onClick={() => setStep(4)}>Next</IonButton>

                    </IonContent>
                </IonModal>
            );
        case 4:
            return (
                <IonModal isOpen={show} onDidDismiss={() => setShow(false)}>
                    <IonToolbar className="modal-header">
                        <IonTitle className="page-title">Select Owner</IonTitle>
                        <IonButtons slot="start">
                            <IonIcon
                                icon={closeIcon}
                                className="matchmaking-close-icon"
                                slot="start"
                                onClick={() => setStep(0)}
                            />
                        </IonButtons>
                    </IonToolbar>
                    <IonContent>
                        <div className="special-guest-wrapper">
                            <SpecialGuestList teamOwners={teamOwners} selectedTeamOwners={selectedTeamOwners} setSelectedTeamOwners={(selected:any) => setSelectedTeamOwners(selected)} />
                            <IonButton expand="block" disabled={!selectedTeamOwners.length} className="guests-selected-generate" onClick={GenerateMatches}>
                                <span>{selectedTeamOwners.length} selected</span>
                                <span>Generate</span>
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>
            );
    }
};

export default Matchmaking;
