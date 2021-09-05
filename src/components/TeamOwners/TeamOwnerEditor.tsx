import React, { useState } from 'react';
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
    IonLabel
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import {upsertTeamOwner} from '../../api/TeamOwners';
import PhoneInput from 'react-phone-input-2';
import { Country, State, City }  from 'country-state-city';

import './TeamOwnerEditor.css';

type TeamOwnerFormData = {
    id?: string;
    name?: string;
    citizen_id?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
};
type EventProps = {
    close: () => void;
    addTeamOwner: () => void;
    teamOwner?: TeamOwnerFormData|false;
};

const TeamOwnerEditor: React.FC<EventProps> = ({addTeamOwner, close, teamOwner = false}) => {
    const [formData, setFormData] = useState<TeamOwnerFormData>({
        id: teamOwner ? teamOwner.id : undefined,
        name: teamOwner ? teamOwner.name : "",
        citizen_id: teamOwner ? teamOwner.citizen_id : "",
        phone: teamOwner ? teamOwner.phone : "",
        country: teamOwner ? teamOwner.country : "",
        state: teamOwner ? teamOwner.state : "",
        city: teamOwner ? teamOwner.city : "",
    });

    const countries = Country.getAllCountries();
    const states = formData.country ? State.getStatesOfCountry(formData.country) : false;
    const cities = (formData.country && formData.state) ? City.getCitiesOfState(formData.country, formData.state) : (formData.country) ? City.getCitiesOfCountry(formData.country) : false;

    const canSubmit = () => {
        let isFormFilled = true;

        if (!formData.name) isFormFilled = false;
        if (!formData.citizen_id) isFormFilled = false;
        if (!formData.phone) isFormFilled = false;
        if (!formData.country) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertTeamOwner(formData);
        if (response.success) {
            addTeamOwner();
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title">{formData.id ? "Update Team Owner" : "Create Team Owner"}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>Save</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                <IonItemDivider>Name</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.name}
                        className="fullsize-input"
                        placeholder="Name"
                        onIonChange={(e) => setFormData({...formData, name: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>Citizen ID</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.citizen_id}
                        className="fullsize-input"
                        placeholder="Your Citizen ID"
                        onIonChange={(e) => setFormData({...formData, citizen_id: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>Phone number</IonItemDivider>
                <PhoneInput
                    country={'us'}
                    countryCodeEditable={false}
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(phone) => setFormData({...formData, phone})}
                />

                <IonItemDivider>Country</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" name="country" value={formData.country} onIonChange={(e) => setFormData({...formData, country: e.detail.value!, state: "", city: ""})} placeholder="Select country">
                        {countries.map((country) => (
                            <IonSelectOption key={country.isoCode} value={country.isoCode}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states && states.length > 0) && <><IonItemDivider>State</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="action-sheet" disabled={!formData.country} name="state" value={formData.state} onIonChange={(e) => setFormData({...formData, state: e.detail.value!, city: ""})} placeholder="Select state">
                            {states.map((state) => (
                                <IonSelectOption key={state.isoCode} value={state.isoCode}>{state.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem></>}

                {(cities && cities.length > 0) && <><IonItemDivider>City</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="action-sheet" disabled={!formData.country || !formData.state} name="city" value={formData.city} onIonChange={(e) => setFormData({...formData, city: e.detail.value!})} placeholder="Select city">
                            {cities.map((city, index) => (
                                <IonSelectOption key={index} value={city.name}>{city.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem></>}
            </IonList>
        </IonContent>
    </>);
};

export default TeamOwnerEditor;
