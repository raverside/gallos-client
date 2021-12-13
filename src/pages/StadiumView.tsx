import {
    IonContent,
    IonPage,
    IonImg,
    IonText, IonLoading, IonToolbar, IonButtons, IonBackButton, IonIcon, IonHeader, useIonActionSheet, IonModal,
} from '@ionic/react';
import Gallery from '../components/Gallery';
import React, {useEffect, useState} from "react";
import {getStadium} from "../api/Stadiums";
import {useParams} from 'react-router-dom';
import {getImageUrl} from '../components/utils';

import './StadiumView.css';
import fullscreenIcon from "../img/fullscreen.png";
import {useTranslation} from "react-multi-lang";
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
import StadiumEditor from "../components/Stadiums/StadiumEditor";

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
    const [showStadiumEditorModal, setShowStadiumEditorModal] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [present, dismiss] = useIonActionSheet();

    useEffect(() => {
        fetchStadium()
    }, []);

    const fetchStadium = async () => {
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
            <IonHeader className="event-view-header">
                <IonToolbar className="arrow-header">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"/>
                    </IonButtons>
                    <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                        buttons: [
                            { text: t('stadiums.edit'), handler: () => { if (stadium) setShowStadiumEditorModal(true); } },
                            { text: t('stadiums.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                        ],
                        header: t('stadiums.settings')
                    })} /></IonButtons>
                </IonToolbar>
            </IonHeader>

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
                <IonModal isOpen={!!showStadiumEditorModal} onDidDismiss={() => setShowStadiumEditorModal(false)}>
                    <StadiumEditor
                        fetchStadiums={fetchStadium}
                        stadium={stadium}
                        close={() => setShowStadiumEditorModal(false)}
                    />
                </IonModal>
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
