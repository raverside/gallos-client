import {
    IonText,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonSelect, IonSelectOption
} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {getCountries, getStatesByCountry, getCitiesByState} from '../../api/Geo';

import './UsersFilter.css';
import {useTranslation} from "react-multi-lang";

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    close: () => void;
};

const UsersFilter: React.FC<FilterProps> = ({filter, setFilter, close}) => {
    const t = useTranslation();
    const [countries, setCountries] = useState<[{id: number, name: string}]>();
    const [states, setStates] = useState<[{id: number, name: string}]>();
    const [cities, setCities] = useState<[{id: number, name: string}]>();
    const [country, setCountry] = useState<number|null>(+filter.country || null);
    const [state, setState] = useState<number|null>(+filter.state || null);
    const [city, setCity] = useState<number|null>(+filter.city || null);
    const [membership, setMembership] = useState<string>(filter.membership || "");
    const [sort, setSort] = useState<string>(filter.sort || "az");

    const fetchCountries = async () => {
        const countries = await getCountries(true);
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
        if (country) fetchStates(country);
        if (state) fetchCities(state);
    }, []);

    const onCountryChange = (country_id:number) => {
        setCountry(country_id);
        setState(null);
        setCity(null);
        country_id && fetchStates(country_id);
    }

    const onStateChange = (state_id:number) => {
        setState(state_id);
        setCity(null);
        state_id && fetchCities(state_id);
    }

    const onCityChange = (city_id:number) => {
        setCity(city_id);
    }

    const clear = () => {
        setCountry(null);
        setState(null);
        setCity(null);
        setMembership("");
        setSort("az");
    }

    const Submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData);

        setFilter(formEntries);
        close();
    }

    return (<form className="users-filter-form" onSubmit={Submit}>
        <div className="users-filter-wrapper">
            <div className="users-filter-header">
                <IonButton fill="clear" onClick={clear}>{t('users.filter_clear')}</IonButton>
                <IonText>{t('users.filter_header')}</IonText>
                <IonButton fill="clear" onClick={close}>{t('users.filter_cancel')}</IonButton>
            </div>
            <IonList>
                <IonLabel>{t('general.country')}</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="country" value={country} onIonChange={(e) => {onCountryChange(e.detail.value)}} placeholder={t('general.country_placeholder')}>
                        {countries && countries.map((country) => (
                            <IonSelectOption key={country.id} value={country.id}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states && states.length > 0) && <><IonLabel>{t('general.state')}</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" disabled={!country} name="state" value={state} onIonChange={(e) => onStateChange(e.detail.value)} placeholder={t('general.state_placeholder')}>
                        {states.map((state) => (
                            <IonSelectOption key={state.id} value={state.id}>{state.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                {(cities && cities.length > 0) && <><IonLabel>{t('general.city')}</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" disabled={!country || !state} name="city" value={city} onIonChange={(e) => onCityChange(e.detail.value)} placeholder={t('general.city_placeholder')}>
                        {cities.map((city) => (
                            <IonSelectOption key={city.id} value={city.id}>{city.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                <IonLabel>{t('users.filter_membership_type')}</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="membership" value={membership} onIonChange={(e) => setMembership(e.detail.value)} placeholder={t('users.filter_membership_type')}>
                        <IonSelectOption value="gold">Gold</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonLabel>{t('general.filter_sort')}</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="sort" value={sort} onIonChange={(e) => setSort(e.detail.value)}>
                        <IonSelectOption value="az">{t('general.filter_sort_az')}</IonSelectOption>
                        <IonSelectOption value="za">{t('general.filter_sort_za')}</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
        </div>
        <IonButton expand="block" type="submit">{t('general.filter_apply')}</IonButton>
    </form>);
};

export default UsersFilter;
