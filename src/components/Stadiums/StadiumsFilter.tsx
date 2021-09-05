import {
    IonText,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonSelect, IonSelectOption
} from '@ionic/react';
import React, {useState} from 'react';
import { Country, State, City }  from 'country-state-city';

import './StadiumsFilter.css';

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    close: () => void;
};

const StadiumsFilter: React.FC<FilterProps> = ({filter, setFilter, close}) => {
    const [country, setCountry] = useState<string>(filter.country || "");
    const [state, setState] = useState<string>(filter.state || "");
    const [city, setCity] = useState<string>(filter.city || "");
    const [membership, setMembership] = useState<string>(filter.membership || "gold");
    const [sort, setSort] = useState<string>(filter.sort || "az");

    const Submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData);

        setFilter(formEntries);
        close();
    }

    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry(country);
    const cities = (country && states.length > 0) ? City.getCitiesOfState(country, state) : City.getCitiesOfCountry(country);

    return (<form className="users-filter-form" onSubmit={Submit}>
        <div className="users-filter-wrapper">
            <div className="users-filter-header">
                <IonText>Filter and Sort</IonText><IonButton fill="clear" onClick={close}>Cancel</IonButton>
            </div>
            <IonList>
                <IonLabel>Country</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" name="country" value={country} onIonChange={(e) => {setCountry(e.detail.value); setState(""); setCity("")}} placeholder="Select country">
                        {countries.map((country) => (
                            <IonSelectOption key={country.isoCode} value={country.isoCode}>{country.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {(states.length > 0) && <><IonLabel>State</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" disabled={!country} name="state" value={state} onIonChange={(e) => {setState(e.detail.value); setCity("")}} placeholder="Select state">
                        {states.map((state) => (
                            <IonSelectOption key={state.isoCode} value={state.isoCode}>{state.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                {(cities && cities.length > 0) && <><IonLabel>City</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" disabled={!country || !state} name="city" value={city} onIonChange={(e) => setCity(e.detail.value)} placeholder="Select city">
                        {cities.map((city, index) => (
                            <IonSelectOption key={index} value={city.name}>{city.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem></>}

                <IonLabel>Membership Type</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" name="membership" value={membership} onIonChange={(e) => setMembership(e.detail.value)} placeholder="Select membership type">
                        <IonSelectOption value="gold">Gold</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonLabel>Sort By</IonLabel>
                <IonItem lines="none">
                    <IonSelect interface="action-sheet" name="sort" value={sort} onIonChange={(e) => setSort(e.detail.value)}>
                        <IonSelectOption value="az">A-Z</IonSelectOption>
                        <IonSelectOption value="za">Z-A</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
        </div>
        <IonButton expand="block" type="submit">Apply</IonButton>
    </form>);
};

export default StadiumsFilter;
