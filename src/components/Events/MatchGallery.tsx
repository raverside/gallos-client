import React, {useState, useEffect} from "react";
import {
    IonModal, IonContent, IonToolbar, IonButtons, IonTitle, IonHeader, IonIcon, IonImg, IonSlides, IonSlide
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";

import './ParticipantGallery.css';
import {useTranslation} from "react-multi-lang";
import {getImageUrl} from "../utils";

type GalleryProps = {
    showModal: any;
    setShowModal: (show:false) => void;
    active: string;
    match: any;
};

const MatchGallery: React.FC<GalleryProps> = ({match, active, showModal, setShowModal}) => {
    const [activeImage, setActiveImage] = useState(active);
    const [title, setTitle] = useState(match ? "#" + match[activeImage]?.cage + " " + match[activeImage]?.team?.name : "");
    const images = [getImageUrl(match?.participant?.image), getImageUrl(match?.opponent?.image)];

    useEffect(() => {
        if (match && active) {
            setTitle(match[active]?.cage + " " + match[active]?.team?.name);
        }
    }, [active]);

    useEffect(() => {
        setTitle(match ? "#" + match[activeImage]?.cage + " " + match[activeImage]?.team?.name : "");
    }, [activeImage]);

    return (
        <IonModal isOpen={!!showModal} onDidDismiss={() => setShowModal(false)} cssClass="gallery-modal">
            <IonHeader>
                <IonToolbar className="modal-header">
                    <IonTitle className="page-title">{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon
                            icon={closeIcon}
                            className="gallery-close-icon"
                            slot="end"
                            size="large"
                            onClick={() => setShowModal(false)}
                        />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="zoomable">
                <IonSlides className="gallery-slider" pager onIonSlidesDidLoad={(e) => {
                    // @ts-ignore
                    e.target.slideTo(activeImage === 'participant' ? 0 : 1);
                }} onIonSlideDidChange={async (e) => {
                    // @ts-ignore
                    (await e.target.getActiveIndex() === 0) ? setActiveImage('participant') : setActiveImage('opponent')
                }}>
                    {images.map((image, index) => (
                        <IonSlide key={"thumb_"+index}><IonImg src={image} className="gallery-participant-image"/></IonSlide>
                    ))}
                </IonSlides>
            </IonContent>
        </IonModal>
    );
};

export default MatchGallery;
