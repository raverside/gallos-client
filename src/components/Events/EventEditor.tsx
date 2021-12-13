import React, {useState, useEffect, useContext} from 'react';
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
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonText
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import ImagePicker from '../ImagePicker';
import {upsertEvent, removeEvent} from '../../api/Events';
import {fetchAllStadiums} from '../../api/Stadiums';
import moment from 'moment';
import ConfirmPrompt from "../ConfirmPrompt";

import './EventEditor.css';
import {AppContext} from "../../State";
import {useTranslation} from "react-multi-lang";

type EventFormData = {
    id?: string|undefined;
    is_special?: boolean;
    image?: string|null|undefined;
    image_upload?: File|null;
    title?: string;
    event_date?: string;
    receiving_time_start?: string;
    receiving_time_end?: string;
    first_race_time?: string;
    currency?: string;
    bronze?: number|null;
    silver_one?: number|null;
    silver_two?: number|null;
    gold_one?: number|null;
    gold_two?: number|null;
    description?: string;
    type?: any[];
    stadium_id?: string;
};
type EventProps = {
    isSpecial: boolean;
    close: () => void;
    fetchEvents: () => void;
    event?: EventFormData|false;
};

const EventEditor: React.FC<EventProps> = ({fetchEvents, isSpecial = false, close, event= false}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
    const [stadiums, setStadiums] = useState<any[]>([]);
    const [formData, setFormData] = useState<EventFormData>({
        id: event ? event.id : undefined,
        is_special: event ? event.is_special : isSpecial,
        image: event ? event.image : null,
        image_upload: null,
        title: event ? event.title : "",
        event_date: event ? event.event_date : moment().format('YYYY-MM-DD'),
        receiving_time_start: event ? event.receiving_time_start : moment().format("HH:mm"),
        receiving_time_end: event ? event.receiving_time_end : moment().format("HH:mm"),
        first_race_time: event ? event.first_race_time : moment().format("HH:mm"),
        currency: event ? event.currency : "USD",
        bronze: event ? event.bronze : null,
        silver_one: event ? event.silver_one : null,
        silver_two: event ? event.silver_two : null,
        gold_one: event ? event.gold_one : null,
        gold_two: event ? event.gold_two : null,
        description: event ? event.description : "",
        type: (event && event.type) ? event.type : ["All"],
        stadium_id: (event && event.stadium_id) ? event.stadium_id : state.user?.stadium?.id
    });

    useEffect(() => {
        if (formData.type?.includes("All") && formData.type.length > 1) {
            setFormData({...formData, type: ["All"]});
        }
    }, [formData.type]);

    useEffect(() => {
        if (state.user?.role === "admin_worker" || state.user?.role === "admin_manager" || state.user?.role === "admin_grand") {
            fetchStadiums();
        }
    }, []);

    const fetchStadiums = async() => {
        const response = await fetchAllStadiums();
        if (response.stadiums) {
            setStadiums(response.stadiums);
        };
    }

    const deleteEvent = (id:string) => {
        removeEvent(id);
        fetchEvents();
        close();
        state.socket?.emit('updateEvents');
    }

    const canSubmit = () => {
        let isFormFilled = true;

        if (!formData.event_date) isFormFilled = false;
        if (!formData.receiving_time_start) isFormFilled = false;
        if (!formData.receiving_time_end) isFormFilled = false;
        if (!formData.first_race_time) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertEvent(formData);
        if (response.event) {
            fetchEvents();
            state.socket?.emit('updateEvents');
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{formData.id ? t('events.update_event') : t('events.create_event')}</p><p className="page-subtitle">{formData.is_special ? t('events.special_event') : t('events.regular_event')}</p></IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('events.submit')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                {stadiums.length > 0 && <>
                    <IonItemDivider>{t('stadiums.stadium')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect value={formData.stadium_id} placeholder={t('stadiums.stadium')} interface="alert" onIonChange={(e) => setFormData({...formData, stadium_id: e.detail.value!})}>
                            {stadiums.map((stadium) => (<IonSelectOption key={stadium.id} value={stadium.id}>{stadium.name}</IonSelectOption>))}
                        </IonSelect>
                    </IonItem>
                </>}

                {formData.is_special && <>
                    <IonItemDivider>{t('events.event_image')}</IonItemDivider>
                    <IonItem lines="none">
                        <ImagePicker eventImage={event ? event.image : null} onPick={(file) => {setFormData({...formData, image: null, image_upload: file});}} />
                    </IonItem>


                    <IonItemDivider>{t('events.event_title')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            value={formData.title}
                            className="fullsize-input"
                            placeholder={t('events.event_title_placeholder')}
                            onIonChange={(e) => setFormData({...formData, title: e.detail.value!})}
                        />
                    </IonItem>
                </>}

                <IonItemDivider>{t('events.event_date')}<IonText color="primary">*</IonText></IonItemDivider>
                <IonItem lines="none">
                    <IonInput placeholder={t('events.event_date_placeholder')} value={formData.event_date} type="date" onIonChange={(e) => setFormData({...formData, event_date: e.detail.value!})} />
                </IonItem>

                <IonItemDivider>{t('events.receiving_time')}<IonText color="primary">*</IonText></IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.receiving_time_start}
                        type="time"
                        placeholder={t('events.starting_time')}
                        onIonChange={(e) => setFormData({...formData,
                            receiving_time_start: (!formData.receiving_time_end || e.detail.value! < formData.receiving_time_end) ? e.detail.value! : formData.receiving_time_end
                        })}
                    />
                    -
                    <IonInput
                        value={formData.receiving_time_end}
                        type="time"
                        placeholder={t('events.ending_time')}
                        onIonChange={(e) => setFormData({...formData,
                            receiving_time_end: (!formData.receiving_time_start || e.detail.value! > formData.receiving_time_start) ? e.detail.value! : formData.receiving_time_start
                        })}
                    />
                </IonItem>

                <IonItemDivider>{t('events.first_race_time')}<IonText color="primary">*</IonText></IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.first_race_time} placeholder={t('events.first_race_time_placeholder')} type="time" onIonChange={(e) => setFormData({...formData,
                        first_race_time: (!formData.receiving_time_start || e.detail.value! > formData.receiving_time_start) ? e.detail.value! : formData.receiving_time_start
                    })} />
                </IonItem>

                <IonItemDivider>{t('events.currency')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.currency} interface="alert" onIonChange={(e) => setFormData({...formData, currency: e.detail.value!})}>
                        <IonSelectOption value="USD">USD</IonSelectOption>
                        <IonSelectOption value="DOP">RD</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItemDivider>{t('events.type')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.type} multiple interface="alert" onIonChange={(e) => {
                        setFormData({...formData, type: e.detail.value});
                    }}>
                        <IonSelectOption value="All">Marcaje Abierto</IonSelectOption>
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

                <IonItemDivider>{t('events.betting_amount')}</IonItemDivider>
                <IonItemDivider className="small-divider">Bronze</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.bronze} type="number" className="currency-input" min="0" max="9999999" placeholder={t('events.betting_amount_placeholder')} onIonChange={(e) => setFormData({...formData, bronze: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider className="small-divider">Silver</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.silver_one} type="number" className="currency-input" min="0" max="9999999" placeholder={t('events.betting_amount_placeholder')} onIonChange={(e) => setFormData({...formData, silver_one: +e.detail.value!})} />
                    &
                    <IonInput value={formData.silver_two} type="number" className="currency-input" min="0" max="9999999" placeholder={t('events.betting_amount_placeholder')} onIonChange={(e) => setFormData({...formData, silver_two: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider className="small-divider">Gold</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.gold_one} type="number" className="currency-input" min="0" max="9999999" placeholder={t('events.betting_amount_placeholder')} onIonChange={(e) => setFormData({...formData, gold_one: +e.detail.value!})} />
                    &
                    <IonInput value={formData.gold_two} type="number" className="currency-input" min="0" max="9999999" placeholder={t('events.betting_amount_placeholder')} onIonChange={(e) => setFormData({...formData, gold_two: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider>Event Description</IonItemDivider>
                <IonItem lines="none">
                    <IonTextarea value={formData.description} maxlength={3000} placeholder="Write description here" onIonChange={(e) => setFormData({...formData, description: e.detail.value!})} />
                </IonItem>

                {formData.id && <IonItem lines="none">
                    <IonButton expand="block" className="delete-button" onClick={() => setShowDeleteModal(true)}>{t('events.delete_button')}</IonButton>
                    <ConfirmPrompt
                        data={formData.id}
                        show={!!showDeleteModal}
                        title={t('events.delete')}
                        subtitle={t('events.delete_confirm')}
                        onResult={(data, isConfirmed) => {isConfirmed && deleteEvent(data); setShowDeleteModal(false)}}
                    />
                </IonItem>}
            </IonList>
        </IonContent>
    </>);
};

export default EventEditor;
