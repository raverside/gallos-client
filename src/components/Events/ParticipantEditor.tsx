import React, {useState, useEffect} from 'react';
import {
    IonButtons,
    IonContent,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonItemDivider,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    IonText, IonTextarea, IonModal
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import AnimalImagePicker from './AnimalImagePicker';
import {upsertParticipant, findParticipantByStadiumData} from '../../api/Events';
import {getTeamOwnerByDigitalId} from '../../api/TeamOwners';

import './ParticipantEditor.css';

type ParticipantFormData = {
    id?: string|undefined;
    event_id: string,
    image?: string|null|undefined;
    image_upload?: File|null;
    image_flipped: boolean;
    cage?: number;
    owner_account_number?: number;
    team_id?: string;
    stadium_id?: string;
    stadium_name?: string;
    betting_amount?: string;
    betting_pref?: string;
    type?: string;
    color?: string;
    cresta?: string;
    alas?: string;
    pata?: string;
    physical_advantage?: string;
    breeder_id?: number;
    breeder_name?: string;
    weight?: string;
    participated_before?: boolean|null;
    status?: string;
    reason?: string;
};
type ParticipantProps = {
    close: () => void;
    fetchEvent: () => void;
    event: any;
    participant?: ParticipantFormData|false;
};

const ParticipantEditor: React.FC<ParticipantProps> = ({fetchEvent, close, event, participant= false}) => {
    const [teams, setTeams] = useState<any[]>([]);
    const [showRejectReason, setShowRejectReason] = useState<boolean>(false);
    const [formData, setFormData] = useState<ParticipantFormData>({
        id: participant ? participant.id : undefined,
        event_id: participant ? participant.event_id : event.id,
        image: participant ? participant.image : null,
        image_upload: null,
        image_flipped: participant ? participant.image_flipped : false,
        cage: participant ? participant.cage : (event?.participants?.length > 0 ? +event.participants?.length + 1 : 1),
        owner_account_number: participant ? participant.owner_account_number : undefined,
        betting_pref: participant ? participant.betting_pref : undefined,
        betting_amount: participant ? participant.betting_amount : undefined,
        team_id: participant ? participant.team_id : undefined,
        type: participant ? participant.type : undefined,
        color: participant ? participant.color : undefined,
        cresta: participant ? participant.cresta : undefined,
        alas: participant ? participant.alas : undefined,
        pata: participant ? participant.pata : "A",
        physical_advantage: participant ? participant.physical_advantage : "none",
        breeder_id: participant ? participant.breeder_id : undefined,
        breeder_name: participant ? participant.breeder_name : undefined,
        weight: participant ? participant.weight : undefined,
        participated_before: participant ? participant.participated_before : undefined,
        status: participant ? participant.status : undefined,
        reason: participant ? participant.reason : undefined,
        stadium_id: participant ? participant.stadium_id : undefined,
        stadium_name: participant ? participant.stadium_name : undefined,
    });
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});

    const fetchTeamOwner = async (id:number) => {
        const response = (id) ? await getTeamOwnerByDigitalId(id) : false;
        if (response.team_owner?.teams) {
            setTeams(response.team_owner.teams);
        } else {
            setTeams([]);
        }
    }

    useEffect(() => {
        if (event.id) {
            if (participant && participant.owner_account_number) {
                fetchTeamOwner(participant.owner_account_number);
            }
        }
    }, []);

    const tryAutoFill = async (stadiumId?:string, stadiumName?:string) => {
        if (stadiumId && stadiumName) {
            const {participant} = await findParticipantByStadiumData(stadiumId, stadiumName);
            if (participant) {
                setFormData((currentFormData) => ({
                    ...currentFormData,
                    type: participant.type,
                    color: participant.color,
                    cresta: participant.cresta,
                    pata: participant.pata,
                    physical_advantage: participant.physical_advantage
                }));
            }
        }
    }

    const canCreate = () => {
        let isFormFilled = true;

        if (!formData.cage) isFormFilled = false;
        if (!formData.owner_account_number) isFormFilled = false;
        if (!formData.team_id) isFormFilled = false;
        if (!formData.betting_amount) isFormFilled = false;

        return isFormFilled;
    }

    const canUpdate = () => {
        let isFormFilled = true;

        if (!formData.cage) isFormFilled = false;
        if (!formData.owner_account_number) isFormFilled = false;
        if (!formData.team_id) isFormFilled = false;
        if (!formData.betting_amount) isFormFilled = false;
        if (!formData.type) isFormFilled = false;
        if (!formData.stadium_id) isFormFilled = false;
        if (!formData.stadium_name) isFormFilled = false;
        if (!formData.color) isFormFilled = false;
        if (!formData.cresta) isFormFilled = false;
        if (!formData.alas) isFormFilled = false;
        if (!formData.pata) isFormFilled = false;
        if (!formData.physical_advantage) isFormFilled = false;
        if (!formData.weight) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertParticipant(formData);
        if (response.participant) {
            fetchEvent();
        }
        if (formData.id) {
            close();
        } else {
            setFormData((currentFormData:ParticipantFormData) => ({
                ...currentFormData,
                id: undefined,
                cage: (response.participant.cage || formData.cage || 1) + 1,
                team_id: undefined,
                betting_amount: undefined,
                betting_pref: undefined
            }));
        }
    }

    const Approve = async () => {
        const newFormData = {...formData, status: "approved"};
        setFormData(newFormData);
        const response = await upsertParticipant(newFormData);
        if (response.participant) {
            fetchEvent();
        }
        close();
    }

    const Reject = async () => {
        const newFormData = {...formData, status: "rejected"};
        setFormData(newFormData);
        const response = await upsertParticipant(newFormData);
        if (response.participant) {
            fetchEvent();
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{!formData.id ? "Add Participant" : "Complete Information"}</p></IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    slot="start"
                    className="close-participant-icon"
                    onClick={() => close()}
                />
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                    {participant && participant.id && <>
                        <IonItemDivider>Animal Image</IonItemDivider>
                        <IonText className="image-flipper-text">Make sure animal image is facing right</IonText>
                        <IonItem className="animalImagePicker" lines="none">
                            <AnimalImagePicker
                                eventImage={participant ? participant.image : null}
                                onPick={(file) => setFormData((currentFormData) => ({...currentFormData, image: null, image_upload: file, image_flipped: false}))}
                                isFlipped={formData.image_flipped || false}
                                setIsFlipped={(isFlipped) => setFormData((currentFormData) => ({...currentFormData, image_flipped: isFlipped}))}
                            />
                        </IonItem>
                    </>}

                    <IonItemDivider>Receiving Cage Number</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            value={formData.cage}
                            className="fullsize-input"
                            type="number"
                            readonly
                            placeholder="Receiving Cage Number"
                        />
                    </IonItem>

                    <IonItemDivider>Owner Account Number</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            value={formData.owner_account_number}
                            className="fullsize-input"
                            type="number"
                            placeholder="Owner Account Number"
                            onWheel={(e:any) => e.target.blur()}
                            onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, owner_account_number: +e.detail.value!}));
                                fetchTeamOwner(+e.detail.value!);
                            }}
                        />
                    </IonItem>

                    <IonItemDivider>Team</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect
                            value={formData.team_id}
                            placeholder="Select Team"
                            disabled={!(teams.length > 0)}
                            interface="alert"
                            onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, team_id: e.detail.value!}))}
                        >
                            <IonLabel>Team</IonLabel>
                            {teams.map((team) => (<IonSelectOption key={team.id} value={team.id}>{team.name}</IonSelectOption>))}
                        </IonSelect>
                    </IonItem>

                    {participant && participant.id && <>
                        <IonItemDivider>Type</IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect value={formData.type} placeholder="Select type" onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, type: e.detail.value}));
                            }}>
                                <IonLabel>Type</IonLabel>
                                <IonSelectOption value="M1">M1</IonSelectOption>
                                <IonSelectOption value="M2">M2</IonSelectOption>
                                <IonSelectOption value="M3">M3</IonSelectOption>
                                <IonSelectOption value="M4">M4</IonSelectOption>
                                <IonSelectOption value="M5">M5</IonSelectOption>
                                <IonSelectOption value="M6">M6</IonSelectOption>
                                <IonSelectOption value="M7">M7</IonSelectOption>
                                <IonSelectOption value="M8">M8</IonSelectOption>
                                <IonSelectOption value="M9">M9</IonSelectOption>
                                <IonSelectOption value="M10">M10</IonSelectOption>
                                <IonSelectOption value="M11">M11</IonSelectOption>
                                <IonSelectOption value="M12">M12</IonSelectOption>
                                <IonSelectOption value="Pollo SM">Pollo SM</IonSelectOption>
                                <IonSelectOption value="Gallo">Gallo</IonSelectOption>
                                <IonSelectOption value="Gallo Pelado">Gallo Pelado</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItemDivider>Stadium ID</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.stadium_id}
                                className="fullsize-input"
                                placeholder="Stadium ID"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => {
                                        tryAutoFill(e.detail.value!, currentFormData.stadium_name);
                                        return {...currentFormData, stadium_id: e.detail.value!}
                                    });
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Stadium Name</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.stadium_name}
                                className="fullsize-input"
                                placeholder="Stadium Name"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => {
                                        tryAutoFill(currentFormData.stadium_id, e.detail.value!);
                                        return {...currentFormData, stadium_name: e.detail.value!}
                                    });
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Color</IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect value={formData.color} placeholder="Select color" onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, color: e.detail.value}));
                            }}>
                                <IonLabel>Color</IonLabel>
                                <IonSelectOption value="canelo">Canelo</IonSelectOption>
                                <IonSelectOption value="cenizo">Cenizo</IonSelectOption>
                                <IonSelectOption value="indio">Indio</IonSelectOption>
                                <IonSelectOption value="pinto">Pinto</IonSelectOption>
                                <IonSelectOption value="giro">Giro</IonSelectOption>
                                <IonSelectOption value="jabado">Jabado</IonSelectOption>
                                <IonSelectOption value="gallino">Gallino</IonSelectOption>
                                <IonSelectOption value="blanco">Blanco</IonSelectOption>
                                <IonSelectOption value="negro">Negro</IonSelectOption>
                                <IonSelectOption value="amarillo">Amarillo</IonSelectOption>
                                <IonSelectOption value="joco">Joco</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItemDivider>Cresta</IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect value={formData.cresta} placeholder="Animal cresta" onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, cresta: e.detail.value}));
                            }}>
                                <IonLabel>Cresta</IonLabel>
                                <IonSelectOption value="peine">Peine</IonSelectOption>
                                <IonSelectOption value="rosa">Rosa</IonSelectOption>
                                <IonSelectOption value="pava">Pava</IonSelectOption>
                                <IonSelectOption value="moton">Moton</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItemDivider>Alas</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.alas}
                                className="fullsize-input"
                                placeholder="Animal Alas"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, alas: e.detail.value!}));
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Pata</IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect value={formData.pata} placeholder="Select pata" onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, pata: e.detail.value}));
                            }}>
                                <IonLabel>Pata</IonLabel>
                                <IonSelectOption value="A">A</IonSelectOption>
                                <IonSelectOption value="AB">AB</IonSelectOption>
                                <IonSelectOption value="BCA">BCA</IonSelectOption>
                                <IonSelectOption value="BB">BB</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItemDivider>Breeder ID</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.breeder_id}
                                className="fullsize-input"
                                type="number"
                                onWheel={(e:any) => e.target.blur()}
                                placeholder="Breeder ID"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, breeder_id: +e.detail.value!}));
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Breeder Name</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.breeder_name}
                                className="fullsize-input"
                                placeholder="Breeder Name"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, breeder_name: e.detail.value!}));
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Weight (Oz)</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.weight}
                                className="fullsize-input"
                                placeholder="Weight"
                                type="number"
                                step=".01"
                                onWheel={(e:any) => e.target.blur()}
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, weight: e.detail.value!}));
                                }}
                            />
                        </IonItem>

                        <IonItemDivider>Participated Before</IonItemDivider>
                        <IonRadioGroup
                            value={formData.participated_before}
                            onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, participated_before: e.detail.value}))}
                            className="yesno_radio"
                        >
                            <IonItem lines="none">
                                <IonLabel>Yes</IonLabel>
                                <IonRadio className="yesno_radio_button" value={true} />
                            </IonItem>
                            <IonItem lines="none">
                                <IonLabel>No</IonLabel>
                                <IonRadio className="yesno_radio_button" value={false} />
                            </IonItem>
                        </IonRadioGroup>

                        <IonItemDivider>Physical Advantage</IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect value={formData.physical_advantage} placeholder="Select physical advantage" onIonChange={(e) => {
                                setFormData((currentFormData) => ({...currentFormData, physical_advantage: e.detail.value}));
                            }}>
                                <IonLabel>Physical Advantage</IonLabel>
                                <IonSelectOption value="none">None</IonSelectOption>
                                <IonSelectOption value="tusa">Tusa</IonSelectOption>
                                <IonSelectOption value="barba">Barba</IonSelectOption>
                                <IonSelectOption value="tusa_barba">Tusa & Barba</IonSelectOption>
                                <IonSelectOption value="pluma">Pluma</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                    </>}


                    <IonItemDivider>Betting Amount</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect
                            value={formData.betting_amount}
                            interface="alert"
                            placeholder="Select Betting Amount"
                            onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, betting_amount: e.detail.value!}))}
                        >
                            <IonLabel>Betting Amount</IonLabel>
                            {event.bronze && <IonSelectOption value="bronze">Bronze: {(event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.bronze)}</IonSelectOption>}
                            {event.silver_one && <IonSelectOption value="silver">
                                Silver: {(event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_one)}
                                {event.silver_two && " & " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_two)}
                            </IonSelectOption>}
                            {event.gold_one && <IonSelectOption value="gold">
                                Gold: {(event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_one)}
                                {event.gold_two && " & " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_two)}
                            </IonSelectOption>}
                        </IonSelect>
                    </IonItem>

                    <IonItemDivider>Betting Preferences</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect
                            value={formData.betting_pref}
                            interface="alert"
                            placeholder="Select Betting Preferences"
                            onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, betting_pref: e.detail.value!}))}
                        >
                            <IonLabel>Betting Preferences</IonLabel>
                            {event.bronze && <IonSelectOption value="bronze">Bronze</IonSelectOption>}
                            {event.silver_one && <IonSelectOption value="silver">Silver</IonSelectOption>}
                            {event.gold_one && <IonSelectOption value="gold">Gold</IonSelectOption>}
                            {(event.bronze && event.silver_one) && <IonSelectOption value="bronze_silver">Bronze & Silver</IonSelectOption>}
                            {(event.silver_one && event.gold_one) && <IonSelectOption value="silver_gold">Silver & Gold</IonSelectOption>}
                            <IonSelectOption value="open">Open (Any)</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem lines="none">
                    {(participant && participant.id) ?
                        <div className="participant-complete-buttons">
                            <IonButton className="participant-approve-button" disabled={!canUpdate()} onClick={Approve}>Approve</IonButton>
                            <IonButton className="participant-reject-button" onClick={() => setShowRejectReason(true)}>Reject</IonButton>
                        </div>
                        : <IonButton expand="block" className="delete-button" disabled={!canCreate()} onClick={Submit}>Add</IonButton>
                    }
                    </IonItem>
                <IonModal isOpen={showRejectReason} onDidDismiss={() => setShowRejectReason(false)} cssClass="reject-participant-modal">
                    <IonToolbar className="modal-header">
                        <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => setShowRejectReason(false)} /></IonButtons>
                        <IonTitle className="page-title">Exclude Participant</IonTitle>
                    </IonToolbar>
                    <IonContent>
                        <div className="reject-participant-modal">
                            <div>
                                <IonText className="add-note-title">Exclusion Reason</IonText>
                                <IonTextarea
                                    className="add-note-input"
                                    placeholder="Write the reason here"
                                    rows={5}
                                    value={formData.reason}
                                    onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, reason: e.detail.value!}))}
                                />
                            </div>
                            <IonButton disabled={!formData.reason} expand="block" onClick={Reject}>Save</IonButton>
                        </div>
                    </IonContent>
                </IonModal>
            </IonList>
        </IonContent>
    </>);
};

export default ParticipantEditor;
