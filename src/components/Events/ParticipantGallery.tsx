import {
    IonModal, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonHeader, IonIcon, IonImg, IonSlides, IonSlide
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";

import './ParticipantGallery.css';
import {useTranslation} from "react-multi-lang";
import {getImageUrl} from "../utils";
import {useContext} from "react";
import {AppContext} from "../../State";
import ReactImageProcess from 'react-image-process';
import watermark from '../../img/logo_club.png';

type GalleryProps = {
    showModal: boolean;
    setShowModal: (show:boolean) => void;
    showPhotoUploader?: (participant:any) => void;
    eventPhase: string;
    participant: any;
};

const ParticipantGallery: React.FC<GalleryProps> = ({participant, showModal, setShowModal, showPhotoUploader, eventPhase}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const title = participant ? "#" + participant.cage + " " + participant.team?.name : "";
    const images = [getImageUrl(participant.image)];

    return (
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="gallery-modal">
            <IonHeader>
                <IonToolbar className="modal-header">
                    {(state.user.role !== "user" && showPhotoUploader && (eventPhase === "receiving" || (state.user.role === "admin" || state.user.role === "admin_manager" || state.user.role === "admin_worker"))) &&
                        <IonButton
                            fill="clear"
                            slot="start"
                            className="edit-photo-button"
                            onClick={() => {setShowModal(false); showPhotoUploader(participant)}}
                        >
                            {t('events.edit_photo')}
                        </IonButton>
                    }
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
            <IonContent className="zoomable" style={{textAlign: 'center'}}>
                <ReactImageProcess
                    mode="waterMark"
                    waterMarkType="image"
                    waterMark={watermark}
                    width={408}
                    height={60}
                    opacity={1}
                    coordinate={[670, 100]}
                >
                    <img src={images[0]} className="gallery-slider gallery-participant-image" />
                </ReactImageProcess>

                {/*<IonSlides className="gallery-slider-thumbnails">*/}
                {/*    {images.map((image, index) => (*/}
                {/*        <IonSlide key={"thumb_"+index} className="gallery-slider-thumbnail"><IonImg src={image} className={participant.image_flipped ? "gallery-participant-image flipped" : "gallery-participant-image"} /></IonSlide>*/}
                {/*    ))}*/}
                {/*</IonSlides>*/}
            </IonContent>
        </IonModal>
    );
};

export default ParticipantGallery;
