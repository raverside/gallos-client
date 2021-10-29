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

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    close: () => void;
};

const UsersFilter: React.FC<FilterProps> = ({filter, setFilter, close}) => {

    const [countries, setCountries] = useState<[{id: number, name: string}]>();
    const [states, setStates] = useState<[{id: number, name: string}]>();
    const [cities, setCities] = useState<[{id: number, name: string}]>();
    const [country, setCountry] = useState<number|null>(+filter.country || null);
    const [state, setState] = useState<number|null>(+filter.state || null);
    const [city, setCity] = useState<number|null>(+filter.city || null);
    const [membership, setMembership] = useState<string>(filter.membership || "");
    const [sort, setSort] = useState<string>(filter.sort || "az");

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
                <IonButton fill="clear" onClick={clear}>Clear</IonButton>
                <IonText>Filter and Sort</IonText>
                <IonButton fill="clear" onClick={close}>Cancel</IonButton>
            </div>
            <IonList>
                <IonLabel>Country</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="country" value={country} onIonChange={(e) => {onCountryChange(e.detail.value)}} placeholder="Select country">
                        {countries && countries.map((country) => (
                            <IonSelectOption key={country.id} value={country.id}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states && states.length > 0) && <><IonLabel>State</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" disabled={!country} name="state" value={state} onIonChange={(e) => onStateChange(e.detail.value)} placeholder="Select state">
                        {states.map((state) => (
                            <IonSelectOption key={state.id} value={state.id}>{state.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                {(cities && cities.length > 0) && <><IonLabel>City</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" disabled={!country || !state} name="city" value={city} onIonChange={(e) => onCityChange(e.detail.value)} placeholder="Select city">
                        {cities.map((city) => (
                            <IonSelectOption key={city.id} value={city.id}>{city.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                <IonLabel>Membership Type</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="membership" value={membership} onIonChange={(e) => setMembership(e.detail.value)} placeholder="Select membership type">
                        <IonSelectOption value="gold">Gold</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonLabel>Sort By</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="sort" value={sort} onIonChange={(e) => setSort(e.detail.value)}>
                        <IonSelectOption value="az">A-Z</IonSelectOption>
                        <IonSelectOption value="za">Z-A</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
        </div>
        <IonButton expand="block" type="submit">Apply</IonButton>
    </form>);
};

export default UsersFilter;
