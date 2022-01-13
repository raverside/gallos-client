import {
    IonContent,
    IonPage,
    IonImg,
    IonText,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonAvatar, IonRouterLink, IonIcon, useIonActionSheet, IonModal, IonLoading,
} from '@ionic/react';
import Gallery from '../components/Gallery';
import React, {useEffect, useState} from "react";
import {getEvent, removeEvent} from "../api/Events";
import {useParams} from 'react-router-dom';
import {getImageUrl, isDesktop} from '../components/utils';

import './EventView.css';
import fullscreenIcon from "../img/fullscreen.png";
import moment from "moment";
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
import EventEditor from "../components/Events/EventEditor";
import ShareEventImage from "../components/Events/ShareEventImage";
import ConfirmPrompt from "../components/ConfirmPrompt";
import {useHistory} from "react-router-dom";

// @ts-ignore
import domtoimage from "dom-to-image-improved";
import {useTranslation} from "react-multi-lang";

type eventType = any;

const EventView: React.FC = () => {
    const t = useTranslation();
    const { id } = useParams<{id:string}>();
    const [event, setEvent] = useState<eventType>();
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [present, dismiss] = useIonActionSheet();
    const [showEventEditorModal, setShowEventEditorModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<string|false>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<eventType|false>(false);
    const history = useHistory();
    const shareRef = React.useRef();

    useEffect(() => {
        fetchEvent()
    }, []);

    const fetchEvent = async () => {
        setShowLoading(true);
        const response = (id) ? await getEvent(id) : false;
        if (response.event) {
            setEvent(response.event);
            setShowLoading(false);
        } else {
            history.replace("/events");
            setShowLoading(false);
        }
    }

    const deleteEvent = (id:string) => {
        removeEvent(id);
        history.replace("/events");
    }

    const shareEvent = async () => {
        if (!event) return false;
        const element = shareRef.current;
        setShowShare(event);
        domtoimage.toBlob(element!).then((blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: "image/png" });
            setShowShare(false);

            if (isDesktop()) {
                //download the file
                const a = document.createElement("a");
                a.href  = window.URL.createObjectURL(file);
                a.setAttribute("download", file.name);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                //share the file
                const filesArray:any = [file];
                if (navigator.canShare && navigator.canShare({files: filesArray})) {
                    navigator.share({files: filesArray});
                }
            }
        });
    }

    const title = (event?.is_special && event?.title) ? event?.title! : t('events.default_event_name');
    const image = (event?.is_special && event?.image) ? getImageUrl(event?.image!) : getImageUrl(event?.stadium_image!);
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});
    const allBets = [event?.bronze, event?.silver_one, event?.silver_two, event?.gold_one, event?.gold_two].filter(x => x !== null);
    const minBet = allBets.length > 0 ? Math.min(...allBets) : false;

    return !event ? <IonLoading isOpen={true} spinner="crescent" /> : (
        <IonPage>
            <IonHeader className="event-view-header">
                <IonToolbar className="arrow-header">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events"/>
                    </IonButtons>
                    <IonButtons slot="end"><IonIcon size="large" className="view-note-menu" icon={menuIcon} slot="end" onClick={() => present({
                        buttons: [
                            { text: t('events.edit'), handler: () => { if (event) setShowEventEditorModal(true); } },
                            { text: t('events.share'), handler: () => { shareEvent()} },
                            { text: t('events.delete'), handler: () => { setShowDeleteModal(event ? event.id : false)} },
                            { text: t('events.cancel'), handler: () => dismiss(), cssClass: 'action-sheet-cancel'}
                        ],
                        header: t('events.settings')
                    })} /></IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="event-big-image">
                    <IonImg src={image}/>
                    <IonImg src={fullscreenIcon} onClick={() => setShowFullscreen(true)} className="fullscreen-icon" />
                </div>
                <div className="event-content-wrapper">
                    <IonCardTitle>{title}</IonCardTitle>
                    <IonCardSubtitle>{moment(event?.event_date).format("dddd, D MMMM YYYY")}</IonCardSubtitle>
                    <IonRouterLink className="event-stadium" routerLink={"/stadium/"+event?.stadium_id}><IonAvatar><IonImg src={getImageUrl(event?.stadium_image)}/></IonAvatar><span>{event?.stadium_name}</span></IonRouterLink>
                    <div className="event-info">
                        <div className="event-info_labels">
                            <div className="event-info_label">{t('events.receiving')}</div>
                            <div className="event-info_label">{t('events.first_race')}</div>
                            {(event.type?.length > 0) && <div className="event-info_label">{t('events.type')}</div>}
                            {(minBet > 0) && <div className="event-info_label">{t('events.bet')}</div>}
                        </div>
                        <div className="event-info_values">
                            <div className="event-info_value">{moment(event?.receiving_time_start, "HH:mm").format("LT")} - {moment(event?.receiving_time_end, "HH:mm").format("LT")}</div>
                            <div className="event-info_value">{moment(event?.first_race_time, "HH:mm").format("LT")}</div>
                            {(event.type?.length > 0) && <div className="event-info_value">{event.type.join(', ')}</div>}
                            {(minBet > 0) && <div className="event-info_value red">
                                {event?.bronze > 0 && ((event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.bronze))}
                                {(event?.silver_one > 0 && (" | " + (event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.silver_one)))}
                                {(event?.silver_two > 0 && (" & " + numberFormatter.formatToParts(event?.silver_two).find(x => x.type === "integer")?.value))}
                                {(event?.gold_one > 0 && (" | " + (event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.gold_one)))}
                                {(event?.gold_two > 0 && (" & " + numberFormatter.formatToParts(event?.gold_two).find(x => x.type === "integer")?.value))}
                            </div>}
                        </div>
                    </div>
                    <IonText>{event?.description}</IonText>
                    <div className="event-phase-baloteo">
                        <IonText className="event-phase-header">{t('events.baloteo_available')}</IonText>
                        <IonText className="event-phase">{t('events.phase_'+event?.phase?.replace(' ', ''))} {t('events.phase')}</IonText>
                    </div>
                </div>
                <Gallery
                    title={title}
                    showModal={showFullscreen}
                    setShowModal={setShowFullscreen}
                    images={[image]}
                />
                <IonModal isOpen={!!showEventEditorModal} onDidDismiss={() => setShowEventEditorModal(false)}>
                    <EventEditor
                        fetchEvents={fetchEvent}
                        isSpecial={event?.is_special}
                        event={event}
                        close={() => setShowEventEditorModal(false)}
                    />
                </IonModal>
                <div style={showShare ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}>
                    <ShareEventImage event={event} close={() => setShowShare(false)}  ref={shareRef} />
                </div>
                <ConfirmPrompt
                    data={showDeleteModal}
                    show={!!showDeleteModal}
                    title={t('events.delete_event')}
                    subtitle={t('events.delete_confirm')}
                    onResult={(data, isConfirmed) => {isConfirmed && deleteEvent(data); setShowDeleteModal(false)}}
                />
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

export default EventView;
