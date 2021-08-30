import React, { useState } from 'react';
import {IonButtons, IonContent, IonIcon, IonTitle, IonToolbar, IonList, IonItem, IonItemDivider, IonInput, IonTextarea, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import ImagePicker from '../ImagePicker';
import {upsertEvent} from '../../api/Events';
import moment from 'moment';

import './EventEditor.css';

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
};
type EventProps = {
    isSpecial: boolean;
    close: () => void;
    addEvent: (event:{id:string, event_date:string}) => void;
    event?: EventFormData|false;
};

const EventEditor: React.FC<EventProps> = ({addEvent, isSpecial = false, close, event= false}) => {
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
        description: event ? event.description : ""
    });

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
            addEvent(response.event);
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{formData.id ? "Update Event" : "Create Event"}</p><p className="page-subtitle">{formData.is_special ? "Special Event" : "Regular Event"}</p></IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>Post</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                {formData.is_special && <>
                    <IonItemDivider>Event Image</IonItemDivider>
                    <IonItem lines="none">
                        <ImagePicker eventImage={event ? event.image : null} onPick={(file) => {setFormData({...formData, image: null, image_upload: file});}} />
                    </IonItem>


                    <IonItemDivider>Event Title</IonItemDivider>
                    <IonItem lines="none">
                        <IonInput
                            value={formData.title}
                            className="fullsize-input"
                            placeholder="Title"
                            onIonChange={(e) => setFormData({...formData, title: e.detail.value!})}
                        />
                    </IonItem>
                </>}

                <IonItemDivider>Event Date</IonItemDivider>
                <IonItem lines="none">
                    <IonInput placeholder="Select Date" value={formData.event_date} type="date" onIonChange={(e) => setFormData({...formData, event_date: e.detail.value!})} />
                </IonItem>

                <IonItemDivider>Receiving Time</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.receiving_time_start}
                        type="time"
                        placeholder="Starting time"
                        onIonChange={(e) => setFormData({...formData,
                            receiving_time_start: (!formData.receiving_time_end || e.detail.value! < formData.receiving_time_end) ? e.detail.value! : formData.receiving_time_end
                        })}
                    />
                    -
                    <IonInput
                        value={formData.receiving_time_end}
                        type="time"
                        placeholder="Ending time"
                        onIonChange={(e) => setFormData({...formData,
                            receiving_time_end: (!formData.receiving_time_start || e.detail.value! > formData.receiving_time_start) ? e.detail.value! : formData.receiving_time_start
                        })}
                    />
                </IonItem>

                <IonItemDivider>First Race Time</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.first_race_time} placeholder="First race time" type="time" onIonChange={(e) => setFormData({...formData,
                        first_race_time: (!formData.receiving_time_start || e.detail.value! > formData.receiving_time_start) ? e.detail.value! : formData.receiving_time_start
                    })} />
                </IonItem>

                <IonItemDivider>Currency</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.currency} interface="action-sheet" onIonChange={(e) => setFormData({...formData, currency: e.detail.value!})}>
                        <IonSelectOption value="USD">USD</IonSelectOption>
                        <IonSelectOption value="DOP">RD</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItemDivider>Betting Amount</IonItemDivider>
                <IonItemDivider className="small-divider">Bronze</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.bronze} type="number" className="currency-input" min="0" max="9999999" placeholder="Enter amount" onIonChange={(e) => setFormData({...formData, bronze: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider className="small-divider">Silver</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.silver_one} type="number" className="currency-input" min="0" max="9999999" placeholder="Enter amount" onIonChange={(e) => setFormData({...formData, silver_one: +e.detail.value!})} />
                    &
                    <IonInput value={formData.silver_two} type="number" className="currency-input" min="0" max="9999999" placeholder="Enter amount" onIonChange={(e) => setFormData({...formData, silver_two: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider className="small-divider">Gold</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.gold_one} type="number" className="currency-input" min="0" max="9999999" placeholder="Enter amount" onIonChange={(e) => setFormData({...formData, gold_one: +e.detail.value!})} />
                    &
                    <IonInput value={formData.gold_two} type="number" className="currency-input" min="0" max="9999999" placeholder="Enter amount" onIonChange={(e) => setFormData({...formData, gold_two: +e.detail.value!})} />
                </IonItem>

                <IonItemDivider>Event Description</IonItemDivider>
                <IonItem lines="none">
                    <IonTextarea value={formData.description} maxlength={3000} placeholder="Write description here" onIonChange={(e) => setFormData({...formData, description: e.detail.value!})} />
                </IonItem>
            </IonList>
        </IonContent>
    </>);
};

export default EventEditor;
