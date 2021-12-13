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
    IonText, IonLabel, IonRadio, IonRadioGroup
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import ImagePicker from '../ImagePicker';
import {upsertStadium} from '../../api/Stadiums';

import './StadiumEditor.css';
import {AppContext} from "../../State";
import {useTranslation} from "react-multi-lang";
import PhoneInput from "react-phone-input-2";
import {getCitiesByState, getCountries, getStatesByCountry} from "../../api/Geo";

type EventProps = {
    close: () => void;
    fetchStadiums: () => void;
    stadium?: any;
};

const StadiumEditor: React.FC<EventProps> = ({fetchStadiums, close, stadium = false}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [formData, setFormData] = useState<any>({
        id: stadium ? stadium.id : undefined,
        name: stadium ? stadium.name : undefined,
        representative_name: stadium ? stadium.representative_name : undefined,
        phone: stadium ? stadium.phone : undefined,
        bio: stadium ? stadium.bio : undefined,
        five_sec: stadium ? stadium.five_sec : false,
        image: stadium ? stadium.image : null,
        image_upload: null,
        logo: stadium ? stadium.logo : null,
        logo_upload: null,
        country: stadium && stadium.country_id ? +stadium.country_id : null,
        state: stadium && stadium.state_id ? +stadium.state_id : null,
        city: stadium && stadium.city_id ? +stadium.city_id : null,
        membership: stadium ? stadium.membership : null,
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
        if (!formData.representative_name) isFormFilled = false;
        if (!formData.phone) isFormFilled = false;
        if (!formData.country) isFormFilled = false;
        if (!formData.state) isFormFilled = false;
        if (!formData.city) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertStadium(formData);
        if (response.stadium) {
            fetchStadiums();
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{formData.id ? t('stadiums.update') : t('stadiums.create')}</p></IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('stadiums.save')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>

                <IonItemDivider>{t('stadiums.name')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.name}
                        className="fullsize-input"
                        placeholder={t('stadiums.name')}
                        onIonChange={(e) => setFormData({...formData, name: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>{t('stadiums.representative_name')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput
                        value={formData.representative_name}
                        className="fullsize-input"
                        placeholder={t('stadiums.representative_name')}
                        onIonChange={(e) => setFormData({...formData, representative_name: e.detail.value!})}
                    />
                </IonItem>

                <IonItemDivider>{t('stadiums.phone')}</IonItemDivider>
                <PhoneInput
                    country={'us'}
                    countryCodeEditable={false}
                    placeholder={t('stadiums.phone')}
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

                <IonItemDivider>{t('stadiums.membership_type')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect interface="alert" name="membership" value={formData.membership} onIonChange={(e) => setFormData({...formData, membership: e.detail.value!})} placeholder={t('stadiums.membership_type')}>
                        <IonSelectOption value={null}>None</IonSelectOption>
                        <IonSelectOption value="gold">Gold</IonSelectOption>
                        <IonSelectOption value="silver">Silver</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItemDivider>{t('stadiums.bio')}</IonItemDivider>
                <IonItem lines="none">
                    <IonTextarea value={formData.bio} maxlength={3000} placeholder={t('stadiums.bio')} onIonChange={(e) => setFormData({...formData, bio: e.detail.value!})} />
                </IonItem>

                <IonItemDivider>{t('stadiums.five_sec')}</IonItemDivider>
                <IonRadioGroup
                    value={formData.five_sec}
                    onIonChange={(e) => setFormData((currentFormData:any) => ({...currentFormData, five_sec: e.detail.value}))}
                    className="yesno_radio"
                >
                    <IonItem lines="none">
                        <IonLabel>{t('stadiums.five_sec_yes')}</IonLabel>
                        <IonRadio className="yesno_radio_button" value={true} />
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel>{t('stadiums.five_sec_no')}</IonLabel>
                        <IonRadio className="yesno_radio_button" value={false} />
                    </IonItem>
                </IonRadioGroup>

                <IonItemDivider>{t('stadiums.image')}</IonItemDivider>
                <IonItem lines="none">
                    <ImagePicker eventImage={stadium ? stadium.image : null} onPick={(file) => {setFormData({...formData, image: null, image_upload: file});}} />
                </IonItem>

                <IonItemDivider>{t('stadiums.logo')}</IonItemDivider>
                <IonItem lines="none">
                    <ImagePicker eventImage={stadium ? stadium.logo : null} onPick={(file) => {setFormData({...formData, logo: null, logo_upload: file});}} />
                </IonItem>

            </IonList>
        </IonContent>
    </>);
};

export default StadiumEditor;
