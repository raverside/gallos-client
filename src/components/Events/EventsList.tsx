import {
    IonCard,
    IonImg,
    IonList,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonAvatar,
    IonText,
    IonIcon, useIonActionSheet, IonLoading,
} from '@ionic/react';
import {getImageUrl} from '../utils';
import moment from 'moment';
import arrowIcon from '../../img/arrow_forward.png';
import React, {useContext, useState} from 'react';

import './EventsList.css';
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";
import {AppContext} from "../../State";
import ShareEventImage from "./ShareEventImage";

// @ts-ignore
import domtoimage from "dom-to-image-improved";
import {useTranslation} from "react-multi-lang";
import {isDesktop} from "../utils";

type EventsListProps = {
    events: Array<{}>;
    openEditor?: (event:{}) => void
};

const EventsList: React.FC<EventsListProps> = ({events, openEditor}) => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [fullDescription, setFullDescription] = useState<string|false>(false);
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});
    const [present, dismiss] = useIonActionSheet();
    const shareRef = React.useRef();
    const [showShare, setShowShare] = useState<any>(false);
    const [showLoading, setShowLoading] = useState<any>(false);

    const shareEvent = (event:any) => {
        if (!event) return false;
        setShowLoading(true);

        const element = shareRef.current;
        setShowShare(event);

        domtoimage.toBlob(element!).then(async (blob:Blob) => {
            const file = new File([blob!], +new Date() + ".png", { type: blob.type });
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
            setShowLoading(false);
        });
    }

    return (<>
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            duration={10000}
            spinner="crescent"
        />
        {(events.length > 0) ? <IonList className="eventsList">
            {events.map((event:any) => {
                const allBets = [event.bronze, event.silver_one, event.silver_two, event.gold_one, event.gold_two].filter(x => x !== null);
                const minBet = allBets.length > 0 ? Math.min(...allBets) : false;

                return <div key={event.id} className="event"><IonCard>
                    <IonButton fill="clear" className="event-stadium" routerLink={"/stadium/"+event.stadium_id}>
                        <IonAvatar><IonImg src={getImageUrl(event.stadium_image)}/></IonAvatar>
                        <span>{event.stadium_name}</span>
                    </IonButton>
                    <IonButton fill="clear" color="dark" className="eventMenu" onClick={() => present({
                        buttons: state.user?.role !== "user" ? [
                            { text: t('events.edit'), handler: () => {openEditor && openEditor(event)} },
                            { text: t('events.share'), handler: () => shareEvent(event)}
                        ] : [
                            { text: t('events.share'), handler: () => shareEvent(event)}
                        ],
                        header: t('events.settings')
                    })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                    <IonButton fill="clear" className="event-image" routerLink={"/event/"+event.id} ><IonImg src={event.is_special && event.image ? getImageUrl(event.image) : getImageUrl(event.stadium_image)} /></IonButton>
                    <IonCardHeader>
                        <IonCardTitle>{(event.is_special && event.title) ? event.title : t('events.default_event_name')}</IonCardTitle>
                        <IonCardSubtitle>{moment(event.event_date).format("dddd, D MMMM YYYY")}</IonCardSubtitle>
                        <div className="event-info">
                            <div className="event-info_labels">
                                <div className="event-info_label">{t('events.receiving')}</div>
                                <div className="event-info_label">{t('events.first_race')}</div>
                                {(event.type?.length > 0) && <div className="event-info_label">{t('events.type')}</div>}
                                {(minBet > 0) && <div className="event-info_label">{t('events.bet')}</div>}
                            </div>
                            <div className="event-info_values">
                                <div className="event-info_value">{moment(event.receiving_time_start, "HH:mm").format("LT")} - {moment(event.receiving_time_end, "HH:mm").format("LT")}</div>
                                <div className="event-info_value">{moment(event.first_race_time, "HH:mm").format("LT")}</div>
                                {(event.type?.length > 0) && <div className="event-info_value">{event.type.join(', ')}</div>}
                                {(minBet > 0) && <div className="event-info_value red">
                                    {event.bronze > 0 && ((event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.bronze))}
                                    {(event.silver_one > 0 && (" | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_one)))}
                                    {(event.silver_two > 0 && (" & " + numberFormatter.formatToParts(event.silver_two).find(x => x.type === "integer")?.value))}
                                    {(event.gold_one > 0 && (" | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_one)))}
                                    {(event.gold_two > 0 && (" & " + numberFormatter.formatToParts(event.gold_two).find(x => x.type === "integer")?.value))}
                                </div>}
                            </div>
                        </div>
                    </IonCardHeader>
                    {event.description && <IonCardContent>
                        {(event.description.length < 90 || fullDescription === event.id) ?
                            <>{event.description} {fullDescription === event.id && <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(false)}>{t('events.read_less')}</IonButton>}</> :
                            <>{event.description.substring(0, 90)}... <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(event.id)}>{t('events.read_more')}</IonButton></>
                        }</IonCardContent>}
                    <IonButton
                        fill="clear"
                        className="baloteoButton"
                        routerLink={state.user?.role === 'user' ? "/event/"+event.id : event.phase === "on going" ? "/baloteo_stats/"+event.id : event.phase === "arrangement" ? "/baloteo/"+event.id : "/event_receiving/"+event.id}
                        disabled={!(state.user?.role === 'admin_manager' || state.user?.role === 'admin_worker' || state.user?.role === 'worker' || state.user?.role === 'user')}
                    >
                        <div className="ionButtonFix">
                            <IonText>{t('events.phase_'+event?.phase?.replace(' ', ''))}</IonText>
                            <div>
                                <IonText>{t('events.see_baloteo')}</IonText>
                                <IonImg src={arrowIcon} />
                            </div>
                        </div>
                    </IonButton>
                </IonCard></div>
            })}
            <div style={showShare ? {opacity: 1, transform: "translateX(100%)", height: "auto"} : {opacity: 0, height:0, overflow: "hidden"}}><ShareEventImage event={showShare} close={() => setShowShare(false)} ref={shareRef} /></div>
        </IonList> : <IonText className="empty-list">{t('events.no_events')}</IonText>}
    </>);
};

export default EventsList;
