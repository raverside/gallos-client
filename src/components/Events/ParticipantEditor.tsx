import React, {useState, useEffect, useContext, useRef} from 'react';
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
    IonText, IonTextarea, IonModal, IonProgressBar, useIonToast
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import AnimalImagePicker from './AnimalImagePicker';
import {upsertParticipant, findParticipantByStadiumData} from '../../api/Events';
import {getTeamOwnerByDigitalId} from '../../api/TeamOwners';

import './ParticipantEditor.css';
import {AppContext} from "../../State";
import {useTranslation} from "react-multi-lang";
import TeamEditor from "../TeamOwners/TeamEditor";

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
    observation?: string;
    team?:any;
};
type ParticipantProps = {
    close: () => void;
    fetchEvent: () => void;
    event: any;
    participant?: ParticipantFormData|false;
};

const ParticipantEditor: React.FC<ParticipantProps> = ({fetchEvent, close, event, participant= false}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [teams, setTeams] = useState<any[]>([]);
    const [teamOwner, setTeamOwner] = useState<any>(false);
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
        participated_before: participant ? participant.participated_before : false,
        status: participant ? participant.status : undefined,
        reason: participant ? participant.reason : undefined,
        observation: participant ? participant.observation : undefined,
        stadium_id: participant ? participant.stadium_id : undefined,
        stadium_name: participant ? participant.stadium_name : (event.stadium_name === "Coliseo Gallistico Santiago") ? "Santiago" : undefined,
    });
    const [presentToast] = useIonToast();
    const [uploading, setUploading] = useState<boolean>(false);
    const [showAddTeamModal, setShowAddTeamModal] = useState<any>(false);
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});
    const [weightLbs, setWeightLbs] = useState<number>((participant && participant.weight) ? Math.floor(parseFloat(participant.weight) / 16) : 0);
    const [weightOz, setWeightOz] = useState<number>((participant && participant.weight) ? parseFloat((((parseFloat(participant.weight) / 16) - weightLbs) * 16).toPrecision(4)) : 0);
    const saveButton = useRef(null);
    const approveButton = useRef(null);

    const fetchTeamOwner = async (id:number) => {
        const response = (id) ? await getTeamOwnerByDigitalId(id) : false;
        if (response.team_owner?.teams) {
            setTeamOwner(response.team_owner);
            setTeams(response.team_owner.teams);
        } else {
            setTeams([]);
            setTeamOwner(false);
        }
    }

    useEffect(() => {
        if (event.id) {
            if (participant && participant.owner_account_number) {
                fetchTeamOwner(participant.owner_account_number);
                setTimeout(() => {
                    const typeField = document.getElementById('typeField');
                    typeField?.focus();
                    typeField?.classList.add('ion-focused');
                }, 700);
            }
        }

        window.addEventListener("keydown", keypressHandler);

        return () => {
            window.removeEventListener("keydown", keypressHandler);
        };
    }, []);

    function keypressHandler(e:any) {
        const existingAlert = document.querySelector('.select-alert');
        if (e.key === 'Enter' && existingAlert) { // submit alert window if there is one
            e.preventDefault();
            const closeAlertButton = existingAlert.querySelector('.alert-button:not(.alert-button-role-cancel)');
            // @ts-ignore
            closeAlertButton && closeAlertButton.click();
            setTimeout(() => focusNextInput(), 200);
        } else if (!existingAlert) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { // focus the previous input
                e.preventDefault();
                focusPrevInput();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { // focus the next input
                e.preventDefault();
                focusNextInput();
            } else if ((e.ctrlKey && e.code === 'Digit1') || e.key === 'F1') {
                e.preventDefault();
                // @ts-ignore
                canUpdate() && !uploading && approveButton?.current?.click();
            } else if ((e.ctrlKey && e.code === 'Digit4') || e.key === 'F4') {
                e.preventDefault();
                canCreate() && !uploading && setShowRejectReason(true);
            } else if ((e.ctrlKey && e.code === 'Digit8') || e.key === 'F8') {
                e.preventDefault();
                // @ts-ignore
                canCreate() && !uploading && saveButton?.current?.click();
            } else if (e.key === 'Enter' && e.target.nodeName === 'INPUT') {
                focusNextInput();
            }
        }
    }

    function focusNextInput() {
        const formContainer = document.getElementById("event-editor");
        const allInputs = formContainer?.querySelectorAll('input:not([readonly]):not([type="hidden"]):not([type="file"]), ion-select');
        if (allInputs) {
            for (var i = 0; i < (allInputs?.length || 0); i++) {
                if (allInputs[i] === document.activeElement && i + 1 <= allInputs?.length) {
                    const nextElement = allInputs[i + 1];
                    if (nextElement) {
                        // @ts-ignore
                        nextElement.focus();
                        // @ts-ignore
                        if (nextElement.nodeName === 'ION-SELECT') nextElement.parentElement.focus();
                        i = allInputs.length;
                    }
                } else if (document.activeElement?.nodeName !== 'INPUT' && document.activeElement?.nodeName !== 'ION-SELECT') {
                    // @ts-ignore
                    allInputs[0].focus();
                }
            }
        }
    }

    function focusPrevInput() {
        const formContainer = document.getElementById("event-editor");
        const allInputs = formContainer?.querySelectorAll('input:not([readonly]):not([type="hidden"]):not([type="file"]), ion-select');
        if (allInputs) {
            for(var i = 0; i < (allInputs?.length || 0); i++) {
                if (allInputs[i] === document.activeElement && i - 1 >= 0) {
                    const nextElement = allInputs[i - 1];
                    if (nextElement) {
                        // @ts-ignore
                        nextElement.focus();
                        // @ts-ignore
                        if (nextElement.nodeName === 'ION-SELECT') nextElement.parentElement.focus();
                        i = allInputs.length;
                    }
                } else if (document.activeElement?.nodeName !== 'INPUT' && document.activeElement?.nodeName !== 'ION-SELECT') {
                    // @ts-ignore
                    allInputs[0].focus();
                }
            }
        }
    }

    const tryAutoFill = async (stadiumId?:string, stadiumName?:string, type?:string) => {
        if (stadiumId && stadiumName && type) {
            const {participant} = await findParticipantByStadiumData(stadiumId, stadiumName, type);
            if (participant) {
                setFormData((currentFormData) => ({
                    ...currentFormData,
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
        if (!formData.betting_pref) isFormFilled = false;

        return isFormFilled;
    }

    const canUpdate = () => {
        let isFormFilled = true;

        if (!formData.cage) isFormFilled = false;
        if (!formData.owner_account_number) isFormFilled = false;
        if (!formData.team_id) isFormFilled = false;
        if (!formData.betting_amount) isFormFilled = false;
        if (!formData.betting_pref) isFormFilled = false;
        if (!formData.type) isFormFilled = false;
        if (!formData.stadium_id) isFormFilled = false;
        if (!formData.stadium_name) isFormFilled = false;
        if (!formData.color) isFormFilled = false;
        if (!formData.cresta) isFormFilled = false;
        if (!formData.pata) isFormFilled = false;
        if (!formData.physical_advantage) isFormFilled = false;
        if (!formData.weight) isFormFilled = false;
        if (formData.participated_before === undefined || formData.participated_before === null) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        setUploading(true);
        const response = await upsertParticipant(formData);
        if (response.participant) {
            fetchEvent();
            setUploading(false);
            state.socket?.emit('updateEvents', {eventId: event.id});
            presentToast(t('events.saved'), 1000);
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
        setUploading(true);
        const newFormData = {...formData, status: "approved"};
        setFormData(newFormData);
        const response = await upsertParticipant(newFormData);
        if (response.participant) {
            fetchEvent();
            setUploading(false);
            state.socket?.emit('updateEvents', {eventId: event.id});
            presentToast(t('events.saved'), 1000);
        }
        close();
    }

    const Reject = async () => {
        setUploading(true);
        const newFormData = {...formData, status: "rejected"};
        setFormData(newFormData);
        const response = await upsertParticipant(newFormData);
        if (response.participant) {
            fetchEvent();
            setUploading(false);
            state.socket?.emit('updateEvents', {eventId: event.id});
            presentToast(t('events.saved'), 1000);
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title add-participant-title">
                <p>{!formData.id ? t('events.add_participant') : t('events.update_participant')}</p>
                {formData.id && participant && <p className="page-subtitle">#{participant.cage} {participant.team?.name}</p>}
            </IonTitle>
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
                        <IonItemDivider>{t('events.animal_image')}</IonItemDivider>
                        <IonText className="image-flipper-text">{t('events.animal_image_hint')}</IonText>
                        <IonItem className="animalImagePicker" lines="none">
                            <AnimalImagePicker
                                eventImage={formData.image || null}
                                onPick={(file) => setFormData((currentFormData) => ({...currentFormData, image: null, image_upload: file}))}
                                isFlipped={formData.image_flipped || false}
                                setIsFlipped={(isFlipped) => setFormData((currentFormData) => ({...currentFormData, image_flipped: isFlipped}))}
                            />
                        </IonItem>
                    </>}

                    <IonItemDivider>{t('events.receiving_cage_number')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            value={formData.cage}
                            className="fullsize-input"
                            type="number"
                            readonly
                            placeholder={t('events.receiving_cage_number')}
                        />
                    </IonItem>

                    <div className="telescope_input">
                        <IonItemDivider>{t('events.owner_account_number')}<IonText color="primary">*</IonText></IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.owner_account_number}
                                className="fullsize-input"
                                id="accountNumberField"
                                type="number"
                                placeholder={t('events.owner_account_number')}
                                onWheel={(e:any) => e.target.blur()}
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, owner_account_number: e.detail.value ? +e.detail.value : undefined}));
                                    fetchTeamOwner(+e.detail.value!);
                                }}
                            />
                        </IonItem>
                    </div>

                    <div className="telescope_input">
                        <IonItemDivider>
                            {t('teams.team_owner')}<IonText color="primary">*</IonText>
                        </IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={teamOwner.name || ""}
                                readonly
                                placeholder={t('teams.team_owner')}
                            />
                        </IonItem>
                    </div>

                    <div className="telescope_input">
                        <IonItemDivider>
                            {t('events.team')}<IonText color="primary">*</IonText>
                        </IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect
                                className="select_team"
                                value={formData.team_id}
                                placeholder={t('events.team')}
                                disabled={!(teams.length > 0)}
                                interface="alert"
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, team_id: e.detail.value!}));
                                }}
                            >
                                <IonLabel>{t('events.team')}</IonLabel>
                                {teams.map((team) => (<IonSelectOption key={team.id} value={team.id}>{team.name}</IonSelectOption>))}
                            </IonSelect>
                        </IonItem>
                    </div>

                    <div className="telescope_input">
                        <IonItem lines="none">
                            <IonButton className="add_team_button" fill="outline" disabled={!teamOwner?.id} onClick={() => setShowAddTeamModal(teamOwner?.id)}>+{t('teams.create_new_team')}</IonButton>
                        </IonItem>
                    </div>

                    {participant && participant.id && <>
                        <div className="telescope_input">
                            <IonItemDivider>{t('events.type')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem id="typeField" lines="none">
                                <IonSelect value={formData.type} placeholder={t('events.type_placeholder')} onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, type: e.detail.value}));
                                }}>
                                    <IonLabel>{t('events.type')}</IonLabel>
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
                                    <IonSelectOption value="Pollo Pelado">Pollo Pelado</IonSelectOption>
                                    <IonSelectOption value="Gallo Pelado">Gallo Pelado</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.stadium_id')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={formData.stadium_id}
                                    className="fullsize-input"
                                    placeholder={t('events.stadium_id')}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => {
                                            tryAutoFill(e.detail.value!, currentFormData.stadium_name, currentFormData.type);
                                            return {...currentFormData, stadium_id: e.detail.value!}
                                        });
                                    }}
                                />
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.stadium_name')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect value={formData.stadium_name} placeholder={t('events.stadium_name')} onIonChange={(e) => {
                                    setFormData((currentFormData) => {
                                        tryAutoFill(currentFormData.stadium_id, e.detail.value!, currentFormData.type);
                                        return {...currentFormData, stadium_name: e.detail.value!}
                                    });
                                }}>
                                    <IonLabel>{t('events.stadium_name')}</IonLabel>
                                    <IonSelectOption value="Santiago">Santiago</IonSelectOption>
                                    <IonSelectOption value="Santo Domingo">Santo Domingo</IonSelectOption>
                                    <IonSelectOption value="Jo Kelner">Jo Kelner</IonSelectOption>
                                    <IonSelectOption value="San Francisco">San Francisco</IonSelectOption>
                                    <IonSelectOption value="Regional">Regional</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.color')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect value={formData.color} placeholder={t('events.color')} onIonChange={(e) => {
                                    setFormData((currentFormData) => {
                                        const newFormData = {...currentFormData, color: e.detail.value}
                                        if (!newFormData.alas) newFormData.alas = newFormData.color;
                                        return newFormData;
                                    });
                                }}>
                                    <IonLabel>{t('events.color')}</IonLabel>
                                    <IonSelectOption value="canelo">Canelo</IonSelectOption>
                                    <IonSelectOption value="cenizo">Cenizo</IonSelectOption>
                                    <IonSelectOption value="indio">Indio</IonSelectOption>
                                    <IonSelectOption value="pinto">Pinto</IonSelectOption>
                                    <IonSelectOption value="giro">Giro</IonSelectOption>
                                    <IonSelectOption value="jabao">Jabao</IonSelectOption>
                                    <IonSelectOption value="gallino">Gallino</IonSelectOption>
                                    <IonSelectOption value="blanco">Blanco</IonSelectOption>
                                    <IonSelectOption value="negro">Negro</IonSelectOption>
                                    <IonSelectOption value="amarillo">Amarillo</IonSelectOption>
                                    <IonSelectOption value="joco">Joco</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.cresta')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect value={formData.cresta} placeholder={t('events.cresta')} onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, cresta: e.detail.value}));
                                }}>
                                    <IonLabel>{t('events.cresta')}</IonLabel>
                                    <IonSelectOption value="peine">Peine</IonSelectOption>
                                    <IonSelectOption value="rosa">Rosa</IonSelectOption>
                                    <IonSelectOption value="pava">Pava</IonSelectOption>
                                    <IonSelectOption value="moton">Moton</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.alas')}</IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={formData.alas}
                                    className="fullsize-input"
                                    placeholder={t('events.alas')}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => ({...currentFormData, alas: e.detail.value!}));
                                    }}
                                />
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.patas')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect value={formData.pata} placeholder={t('events.patas')} onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, pata: e.detail.value}));
                                }}>
                                    <IonLabel>{t('events.patas')}</IonLabel>
                                    <IonSelectOption value="A">A</IonSelectOption>
                                    <IonSelectOption value="AB">AB</IonSelectOption>
                                    <IonSelectOption value="BCA">BCA</IonSelectOption>
                                    <IonSelectOption value="BB">BB</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.physical_advantage')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect value={formData.physical_advantage} placeholder={t('events.physical_advantage')} onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, physical_advantage: e.detail.value}));
                                }}>
                                    <IonLabel>{t('events.physical_advantage')}</IonLabel>
                                    <IonSelectOption value="none">None</IonSelectOption>
                                    <IonSelectOption value="tusa">Tusa</IonSelectOption>
                                    <IonSelectOption value="barba">Barba</IonSelectOption>
                                    <IonSelectOption value="tusa_barba">Tusa & Barba</IonSelectOption>
                                    <IonSelectOption value="pluma">Pluma</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.breeder_id')}</IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={formData.breeder_id}
                                    className="fullsize-input"
                                    type="number"
                                    onWheel={(e:any) => e.target.blur()}
                                    placeholder={t('events.breeder_id')}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => ({...currentFormData, breeder_id: e.detail.value ? +e.detail.value : undefined}));
                                    }}
                                />
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.breeder_name')}</IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={formData.breeder_name}
                                    className="fullsize-input"
                                    placeholder={t('events.breeder_name')}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => ({...currentFormData, breeder_name: e.detail.value!}));
                                    }}
                                />
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.weight')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={weightLbs > 0 ? weightLbs : undefined}
                                    className="fullsize-input weightInput"
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="9"
                                    onWheel={(e:any) => e.target.blur()}
                                    onIonChange={(e) => {
                                        let newLbs = e.detail.value ? parseInt(e.detail.value) : 0;
                                        if (newLbs > 9) newLbs = 9;
                                        setWeightLbs(newLbs);
                                        const newWeightOz = weightOz || 0;
                                        setFormData((currentFormData) => ({...currentFormData, weight: ""+((newLbs * 16) + newWeightOz)}));
                                    }}
                                />
                                <IonInput
                                    value={weightOz > 0 ? weightOz : undefined}
                                    className="fullsize-input weightInput"
                                    type="number"
                                    step=".1"
                                    min="0.1"
                                    max="15.9"
                                    onWheel={(e:any) => e.target.blur()}
                                    onIonChange={(e) => {
                                        let newOz = e.detail.value ? parseFloat(e.detail.value) : 0;
                                        if (newOz > 15.9) newOz = 15.9;
                                        setWeightOz(newOz);
                                        const newWeightLbs = weightLbs || 0;
                                        setFormData((currentFormData) => ({...currentFormData, weight: ""+((newWeightLbs * 16) + newOz)}));
                                    }}
                                />
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.participated_before')}<IonText color="primary">*</IonText></IonItemDivider>
                            <IonItem lines="none">
                                <IonSelect
                                    value={formData.participated_before}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => ({...currentFormData, participated_before: e.detail.value}));
                                    }}
                                >
                                    <IonLabel>{t('events.participated_before')}</IonLabel>
                                    <IonSelectOption value={false}>{t('events.participated_no')}</IonSelectOption>
                                    <IonSelectOption value={true}>{t('events.participated_yes')}</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>

                        <div className="telescope_input">
                            <IonItemDivider>{t('events.observation')}</IonItemDivider>
                            <IonItem lines="none">
                                <IonInput
                                    value={formData.observation}
                                    className="fullsize-input"
                                    placeholder={t('events.observation')}
                                    onIonChange={(e) => {
                                        setFormData((currentFormData) => ({...currentFormData, observation: e.detail.value!}));
                                    }}
                                />
                            </IonItem>
                        </div>
                    </>}

                    <div className="telescope_input">
                        <IonItemDivider>{t('events.betting_amount')}<IonText color="primary">*</IonText></IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect
                                value={formData.betting_amount}
                                interface="alert"
                                placeholder={t('events.betting_amount')}
                                onIonChange={(e) => {
                                    setFormData((currentFormData) => ({...currentFormData, betting_amount: e.detail.value!}));
                                    if (e.detail.value === 'bronze') setFormData((currentFormData) => ({...currentFormData, betting_pref: 'bronze'}));
                                }}
                            >
                                <IonLabel>{t('events.betting_amount')}</IonLabel>
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
                    </div>

                    <div className="telescope_input">
                        <IonItemDivider>{t('events.betting_preference')}<IonText color="primary">*</IonText></IonItemDivider>
                        <IonItem lines="none">
                            <IonSelect
                                value={formData.betting_pref}
                                interface="alert"
                                placeholder={t('events.betting_preference')}
                                onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, betting_pref: e.detail.value!}))}
                                disabled={!formData.betting_amount}
                            >
                                <IonLabel>{t('events.betting_preference')}</IonLabel>
                                {(event.bronze && formData.betting_amount === 'bronze') && <IonSelectOption value="bronze">Bronze</IonSelectOption>}

                                {(event.silver_one && formData.betting_amount === 'silver') && <IonSelectOption value="silver">Silver</IonSelectOption>}
                                {(event.bronze && event.silver_one && formData.betting_amount === 'silver') && <IonSelectOption value="bronze_silver">Bronze & Silver</IonSelectOption>}

                                {(event.gold_one && formData.betting_amount === 'gold') && <IonSelectOption value="gold">Gold</IonSelectOption>}
                                {(event.silver_one && event.gold_one && formData.betting_amount === 'gold') && <IonSelectOption value="silver_gold">Silver & Gold</IonSelectOption>}
                                {(formData.betting_amount === 'gold') && <IonSelectOption value="open">{t('events.betting_preference_open')}</IonSelectOption>}
                            </IonSelect>
                        </IonItem>
                    </div>

                    {(participant && participant.id) ? <>
                            <IonItem lines="none">
                                <IonButton expand="block" fill="outline" className="save-button" disabled={!canCreate() || uploading} onClick={Submit} ref={saveButton}>{t('events.save')}</IonButton>
                            </IonItem>
                            <IonItem lines="none">
                                <div className="participant-complete-buttons">
                                    <IonButton className="participant-approve-button" disabled={!canUpdate() || uploading} onClick={Approve} ref={approveButton}>{t('events.participant_approve')}</IonButton>
                                    <IonButton className="participant-reject-button" disabled={uploading} onClick={() => setShowRejectReason(true)}>{t('events.participant_reject')}</IonButton>
                                </div>
                            </IonItem>
                    </> : <IonItem lines="none">
                        <IonButton expand="block" className="delete-button" disabled={!canCreate() || uploading} onClick={Submit}>{t('events.participant_add')}</IonButton>
                    </IonItem>
                    }
                    {uploading && <IonProgressBar className="progressBar" type="indeterminate" />}
                <IonModal isOpen={showRejectReason} onDidDismiss={() => setShowRejectReason(false)} cssClass="reject-participant-modal">
                    <IonToolbar className="modal-header">
                        <IonButtons slot="start"><IonIcon size="large" icon={closeIcon} slot="start" onClick={() => setShowRejectReason(false)} /></IonButtons>
                        <IonTitle className="page-title">{t('events.reject_header')}</IonTitle>
                    </IonToolbar>
                    <IonContent>
                        <div className="reject-participant-modal">
                            <div>
                                <IonText className="add-note-title">{t('events.reject_reason')}</IonText>
                                <IonTextarea
                                    className="add-note-input"
                                    placeholder={t('events.reject_reason_placeholder')}
                                    rows={5}
                                    value={formData.reason}
                                    onIonChange={(e) => setFormData((currentFormData) => ({...currentFormData, reason: e.detail.value!}))}
                                />
                            </div>
                            <IonButton disabled={!formData.reason} expand="block" onClick={Reject}>Save</IonButton>
                        </div>
                    </IonContent>
                </IonModal>
                <IonModal isOpen={!!showAddTeamModal} onDidDismiss={() => setShowAddTeamModal(false)}>
                    <TeamEditor teamOwnerId={showAddTeamModal} fetchTeamOwner={() => fetchTeamOwner(formData.owner_account_number!)} close={() => setShowAddTeamModal(false)}/>
                </IonModal>
            </IonList>
        </IonContent>
    </>);
};

export default ParticipantEditor;
