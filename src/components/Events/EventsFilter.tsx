import {
    IonText,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonSelect, IonSelectOption, IonModal, IonSearchbar, IonIcon
} from '@ionic/react';
import React, {useState} from 'react';
import { Country, State, City }  from 'country-state-city';

import './EventsFilter.css';
import {filter as filterIcon} from "ionicons/icons";

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    search: string;
    setSearch: (search:string) => void;
    updateFilter: (search:any, filter:any) => void;
};

const EventsFilter: React.FC<FilterProps> = ({filter, setFilter, search, setSearch, updateFilter}) => {
    const [country, setCountry] = useState<string>(filter.country || "");
    const [state, setState] = useState<string>(filter.state || "");
    const [city, setCity] = useState<string>(filter.city || "");
    const [type, setType] = useState<string>(filter.type || "special");
    const [sort, setSort] = useState<string>(filter.sort || "az");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const Submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData);

        setFilter(formEntries);
        setShowFilterModal(false);
        updateFilter(search, filter);
    }

    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry(country);
    const cities = (country && states.length > 0) ? City.getCitiesOfState(country, state) : City.getCitiesOfCountry(country);

    return (<>
        <div className="search-filter-block">
            <IonSearchbar className="searchbar" placeholder="Search username or label" value={search} onIonChange={e => {setSearch(e.detail.value!); updateFilter(e.detail.value!, filter);}} />
            <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                <IonIcon icon={filterIcon} color="dark" />
            </IonButton>
        </div>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="users-filter-form" onSubmit={Submit}>
                <div className="users-filter-wrapper">
                    <div className="users-filter-header">
                        <IonText>Filter and Sort</IonText><IonButton fill="clear" onClick={() => setShowFilterModal(false)}>Cancel</IonButton>
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

                        <IonLabel>Event Type</IonLabel>
                        <IonItem lines="none">
                            <IonSelect interface="action-sheet" name="type" value={type} onIonChange={(e) => setType(e.detail.value)} placeholder="Select event type">
                                <IonSelectOption value="special">Special</IonSelectOption>
                                <IonSelectOption value="regular">Regular</IonSelectOption>
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
            </form>
        </IonModal>
    </>);
};

export default EventsFilter;
