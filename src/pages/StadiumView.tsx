import {
    IonContent,
    IonPage,
    IonImg,
    IonText,
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import React, {useEffect, useState} from "react";
import {getStadium} from "../api/Stadiums";
import {useParams} from 'react-router-dom';
import {getImageUrl} from '../components/utils';
import { Country }  from 'country-state-city';

import './StadiumView.css';

type stadiumType = {
    id: string;
    image: string|null;
    name: string;
    representative_name: string;
    phone: string;
    city: string;
    country: string;
    bio: string;
    created_at: string;
};

const StadiumView: React.FC = () => {
    const { id } = useParams<{id:string}>();
    const [stadium, setStadium] = useState<stadiumType>();

    useEffect(() => {
        fetchStadium()
    }, []);

    const fetchStadium= async () => {
        const response = (id) ? await getStadium(id) : false;
        if (response.stadium) {
            setStadium(response.stadium);
        }
    }

    const country = stadium?.country ? Country.getCountryByCode(stadium.country)?.name : "";

    return (
        <IonPage>
            <ArrowHeader title="" backHref="/stadiums" className="stadium-view-header"/>

            <IonContent fullscreen>
                <IonImg className="stadium-big-image" src={getImageUrl(stadium?.image!)} />
                <div className="stadium-view-info">
                    <IonText className="stadium-view-info_name">{stadium?.name}</IonText>
                    <IonText className="stadium-view-info_representative_name">{stadium?.representative_name}</IonText>
                    <IonText className="stadium-view-info_membership" color="gold">Gold</IonText>
                    <IonText className="stadium-view-info_location">{stadium?.city}, {country}</IonText>
                    <IonText className="stadium-view-info_phone">{stadium?.phone}</IonText>
                    <IonText className="stadium-view-info_bio">{stadium?.bio}</IonText>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default StadiumView;
