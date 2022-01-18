import {
    IonContent,
    IonPage,
    IonAvatar,
    IonImg,
    IonText,
    IonButton,
    IonDatetime, IonLoading, IonItemDivider, IonItem, IonInput, IonList, IonSelect, IonSelectOption
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import React, {useContext, useEffect, useRef, useState} from "react";
import {updateCurrentUser} from "../api/Users";
import {getImageUrl} from '../components/utils';

import './CurrentUserProfile.css';
import {AppContext} from "../State";
import {getCitiesByState, getCountries, getStatesByCountry} from "../api/Geo";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-multi-lang";

const CurrentUserProfile: React.FC = () => {
    const t = useTranslation();
    const { state, dispatch } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [countries, setCountries] = useState<[{id: number, name: string}]>();
    const [states, setStates] = useState<[{id: number, name: string}]>();
    const [cities, setCities] = useState<[{id: number, name: string}]>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string>((state.user?.photo && state.user?.photo !== 'avatar') ? getImageUrl(state.user.photo) : getImageUrl('avatar'));
    const [formData, setFormData] = useState<any>({
        username: state.user?.username,
        birthday: state.user?.birthday,
        country: state.user?.country_id,
        state: state.user?.state_id,
        city: state.user?.city_id,
        photo_upload: null
    });
    const history = useHistory();

    const fetchCountries = async () => {
        const countries = await getCountries(false);
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

    const setImage = (_event: any) => {
        let file = _event.target.files![0];
        setFormData({...formData, photo_upload: file});
        const reader = new FileReader();
        reader.onload = (e) => {
            typeof e.target!.result === "string" && setImagePreview(e.target!.result);
        };

        reader.readAsDataURL(file);
    }

    const canSubmit = () => {
        return (formData.username && formData.country && formData.state && formData.city);
    }

    const Submit = async () => {
        const response = await updateCurrentUser(formData);
        if (response.user) {
            dispatch({
                type: 'setUser',
                user: response.user
            });
            history.push('/');
        }
    }

    return (
        <IonPage>
            <ArrowHeader title={t('profile.header')} backHref="/" />

            <IonContent fullscreen>
                <div className="current-user-profile">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={setImage}
                        accept="image/jpeg, image/png"
                    />
                    <IonText>{t('profile.picture')}</IonText>
                    {state.user?.photo && <IonAvatar><IonImg src={imagePreview} /></IonAvatar>}
                    <IonButton fill="clear" onClick={() => fileInputRef.current!.click()}>{t('profile.upload')}</IonButton>

                    <IonList>
                        <IonItemDivider>{t('profile.name')}</IonItemDivider>
                        <IonItem lines="none">
                            <IonInput
                                value={formData.username}
                                className="fullsize-input"
                                placeholder={t('profile.name_placeholder')}
                                onIonChange={(e) => setFormData({...formData, username: e.detail.value!})}
                            />
                        </IonItem>

                        {/*<IonItemDivider>{t('profile.dob')}</IonItemDivider>*/}
                        {/*<IonItem lines="none">*/}
                        {/*    <IonDatetime*/}
                        {/*        displayFormat="DD MMM YYYY"*/}
                        {/*        placeholder={t('profile.dob_placeholder')}*/}
                        {/*        value={formData.birthday}*/}
                        {/*        onIonChange={e => setFormData({...formData, birthday: e.detail.value!})}*/}
                        {/*    />*/}
                        {/*</IonItem>*/}

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
                            <IonItem>
                                <IonButton disabled={!canSubmit()} expand="block" className="save-button" onClick={Submit}>{t('profile.submit')}</IonButton>
                            </IonItem>
                    </IonList>
                </div>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    duration={10000}
                    spinner="crescent"
                />
            </IonContent>
        </IonPage>
    );
};

export default CurrentUserProfile;
