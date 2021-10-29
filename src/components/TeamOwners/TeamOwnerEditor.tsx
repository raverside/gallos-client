import React, {useEffect, useState} from 'react';
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
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import {upsertTeamOwner} from '../../api/TeamOwners';
import PhoneInput from 'react-phone-input-2';
import {getCountries, getStatesByCountry, getCitiesByState} from '../../api/Geo';

import './TeamOwnerEditor.css';

type TeamOwnerFormData = {
    id?: string;
    name?: string;
    citizen_id?: string;
    phone?: string;
    country?: number|null;
    state?: number|null;
    city?: number|null;
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
        country: teamOwner && teamOwner.country ? +teamOwner.country : null,
        state: teamOwner && teamOwner.state ? +teamOwner.state : null,
        city: teamOwner && teamOwner.city ? +teamOwner.city : null,
    });

    const [countries, setCountries] = useState<[{id: number, name: string}]>();
    const [states, setStates] = useState<[{id: number, name: string}]>();
    const [cities, setCities] = useState<[{id: number, name: string}]>();

    const fetchCountries = async () => {
        const countries = await getCountries();
        if (countries.countries?.length > 0) {
            setCountries(countries.countries);
        }
    }

    const fetchStates = async (country_id:number) => {
        const states = await getStatesByCountry(country_id);
        if (states.states?.length > 0) {
            setStates(states.states);
        }
    }

    const fetchCities = async (state_id:number) => {
        const cities = await getCitiesByState(state_id);
        if (cities.cities?.length > 0) {
            setCities(cities.cities);
        }
    }

    useEffect(() => {
        fetchCountries();
        if (formData.country) fetchStates(formData.country);
        if (formData.state) fetchCities(formData.state);
    }, []);

    const onCountryChange = (country_id:number) => {
        setFormData({
            ...formData,
            country: country_id,
            state: null,
            city: null
        });
        fetchStates(country_id);
    }

    const onStateChange = (state_id:number) => {
        setFormData({
            ...formData,
            state: state_id,
            city: null
        });
        fetchCities(state_id);
    }

    const onCityChange = (city_id:number) => {
        setFormData({
            ...formData,
            city: city_id
        });
    }

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
                    <IonSelect interface="alert" name="country" value={formData.country} onIonChange={(e) => onCountryChange(e.detail.value)} placeholder="Select country">
                        {countries && countries.map((country) => (
                            <IonSelectOption key={country.id} value={country.id}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states && states.length > 0) && <><IonItemDivider>State</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="alert" disabled={!formData.country} name="state" value={formData.state} onIonChange={(e) => onStateChange(e.detail.value)} placeholder="Select state">
                            {states.map((state) => (
                                <IonSelectOption key={state.id} value={state.id}>{state.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem></>}

                {(cities && cities.length > 0) && <><IonItemDivider>City</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="alert" disabled={!formData.country || !formData.state} name="city" value={formData.city} onIonChange={(e) => onCityChange(e.detail.value)} placeholder="Select city">
                            {cities.map((city) => (
                                <IonSelectOption key={city.id} value={city.id}>{city.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem></>}
            </IonList>
        </IonContent>
    </>);
};

export default TeamOwnerEditor;
