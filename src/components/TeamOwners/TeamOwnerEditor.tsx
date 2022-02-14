import React, {useContext, useEffect, useState} from 'react';
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
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-multi-lang";
import {AppContext} from "../../State";

type TeamOwnerFormData = {
    id?: string;
    name?: string;
    citizen_id?: string;
    phone?: string;
    country?: number|null;
    country_id?: number|null;
    state?: number|null;
    state_id?: number|null;
    city?: number|null;
    city_id?: number|null;
};
type EventProps = {
    close: () => void;
    addTeamOwner: () => void;
    teamOwner?: TeamOwnerFormData|false;
};

const TeamOwnerEditor: React.FC<EventProps> = ({addTeamOwner, close, teamOwner = false}) => {
    const t = useTranslation();
    const [formData, setFormData] = useState<TeamOwnerFormData>({
        id: teamOwner ? teamOwner.id : undefined,
        name: teamOwner ? teamOwner.name : "",
        citizen_id: teamOwner ? teamOwner.citizen_id : "",
        phone: teamOwner ? teamOwner.phone : "",
        country: teamOwner && teamOwner.country_id ? +teamOwner.country_id : null,
        state: teamOwner && teamOwner.state_id ? +teamOwner.state_id : null,
        city: teamOwner && teamOwner.city_id ? +teamOwner.city_id : null,
    });

    const [countries, setCountries] = useState<[{id: number, name: string}]>();
    const [states, setStates] = useState<[{id: number, name: string}]>();
    const [cities, setCities] = useState<[{id: number, name: string}]>();
    const history = useHistory();
    const { state } = useContext(AppContext);

    const fetchCountries = async () => {
        const countries = await getCountries(true);
        if (countries.countries?.length > 0) {
            setCountries(countries.countries);
        }
    }

    const fetchStates = async (country_id:number) => {
        if (country_id > 0) {
            const states = await getStatesByCountry(country_id);
            if (states.states?.length > 0) {
                setStates(states.states);
            }
        }
    }

    const fetchCities = async (state_id:number) => {
        if (state_id > 0) {
            const cities = await getCitiesByState(state_id);
            if (cities.cities?.length > 0) {
                setCities(cities.cities);
            }
        }
    }

    useEffect(() => {
        fetchCountries();
        if (formData.country) fetchStates(formData.country);
        if (formData.state) fetchCities(formData.state);
    }, []);

    const onCountryChange = (country_id:number) => {
        if (!country_id) return false;
        setFormData({
            ...formData,
            country: country_id,
            state: null,
            city: null
        });
        fetchStates(country_id);
    }

    const onStateChange = (state_id:number) => {
        if (!state_id) return false;
        setFormData({
            ...formData,
            state: state_id,
            city: null
        });
        fetchCities(state_id);
    }

    const onCityChange = (city_id:number) => {
        if (!city_id) return false;
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
        if (!formData.state) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertTeamOwner(formData);
        if (response.success) {
            addTeamOwner();
            state.socket?.emit('updateEvents');
        }
        close();
        if (response.team_owner) {
            history.replace("/team_owner/" + response.team_owner.id);
        }
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title">{formData.id ? t('teams.update_team_owner') : t('teams.create_team_owner')}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('teams.submit')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                <IonItemDivider>{t('teams.name')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.name}
                        className="fullsize-input"
                        placeholder={t('teams.name')}
                        onIonChange={(e) => setFormData({...formData, name: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>{t('teams.citizen_id')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.citizen_id}
                        className="fullsize-input"
                        placeholder={t('teams.citizen_id')}
                        onIonChange={(e) => setFormData({...formData, citizen_id: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>{t('teams.phone')}</IonItemDivider>
                <PhoneInput
                    country={'us'}
                    countryCodeEditable={false}
                    placeholder={t('teams.phone')}
                    value={formData.phone}
                    onChange={(phone) => setFormData({...formData, phone})}
                />

                <IonItemDivider>{t('general.country')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="country" value={formData.country} onIonChange={(e) => onCountryChange(e.detail.value)} placeholder={t('general.country_placeholder')}>
                        {countries && countries.map((country) => (
                            <IonSelectOption key={country.id} value={country.id}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states && states.length > 0) && <><IonItemDivider>{t('general.state')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="alert" disabled={!formData.country} name="state" value={formData.state} onIonChange={(e) => onStateChange(e.detail.value)} placeholder={t('general.state_placeholder')}>
                            {states.map((state) => (
                                <IonSelectOption key={state.id} value={state.id}>{state.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem></>}

                {(cities && cities.length > 0) && <><IonItemDivider>{t('general.city')}</IonItemDivider>
                    <IonItem lines="none">
                        <IonSelect interface="alert" disabled={!formData.country || !formData.state} name="city" value={formData.city} onIonChange={(e) => onCityChange(e.detail.value)} placeholder={t('general.city_placeholder')}>
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
