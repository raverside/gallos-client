import {
    IonContent,
    IonPage,
    IonImg,
    IonText, IonLoading,
} from '@ionic/react';
import ArrowHeader from '../components/Header/ArrowHeader';
import Gallery from '../components/Gallery';
import React, {useEffect, useState} from "react";
import {getStadium} from "../api/Stadiums";
import {useParams} from 'react-router-dom';
import {getImageUrl} from '../components/utils';

import './StadiumView.css';
import fullscreenIcon from "../img/fullscreen.png";
import {useTranslation} from "react-multi-lang";

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
    const t = useTranslation();
    const { id } = useParams<{id:string}>();
    const [stadium, setStadium] = useState<stadiumType>();
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchStadium()
    }, []);

    const fetchStadium= async () => {
        setShowLoading(true);
        const response = (id) ? await getStadium(id) : false;
        if (response.stadium) {
            setStadium(response.stadium);
            setShowLoading(false);
        } else {
            setShowLoading(false);
        }
    }

    return (
        <IonPage>
            <ArrowHeader title="" backHref="/stadiums" className="stadium-view-header"/>

            <IonContent fullscreen>
                <div className="stadium-big-image">
                    <IonImg src={getImageUrl(stadium?.image!)}/>
                    <IonImg src={fullscreenIcon} onClick={() => setShowFullscreen(true)} className="fullscreen-icon" />
                </div>
                <div className="stadium-view-info">
                    <IonText className="stadium-view-info_name">{stadium?.name}</IonText>
                    <IonText className="stadium-view-info_representative_name">{stadium?.representative_name}</IonText>
                    <IonText className="stadium-view-info_membership" color="gold">Gold</IonText>
                    <IonText className="stadium-view-info_location">{stadium?.city}, {stadium?.country}</IonText>
                    <IonText className="stadium-view-info_phone">{stadium?.phone}</IonText>
                    <IonText className="stadium-view-info_bio">{stadium?.bio}</IonText>
                </div>
                <Gallery
                    title={stadium?.name || ""}
                    showModal={showFullscreen}
                    setShowModal={setShowFullscreen}
                    images={[getImageUrl(stadium?.image!)]}
                />
            </IonContent>
            <IonLoading
                isOpen={showLoading}
                onDidDismiss={() => setShowLoading(false)}
                duration={10000}
                spinner="crescent"
            />
        </IonPage>
    );
};

export default StadiumView;
