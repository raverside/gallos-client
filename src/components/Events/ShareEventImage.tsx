import {IonImg} from '@ionic/react';
import React, {useState} from "react";

import {getImageUrl} from '../utils';

import './ShareEventImage.css';
import moment from "moment";
import logo from "../../img/logo.png";


const ShareEventImage = React.forwardRef<any, any>(({event, close}, ref) => {
    const title = (event?.is_special && event?.title) ? event?.title! : "Traditional Events";
    const image = (event?.is_special && event?.image) ? getImageUrl(event?.image!) : getImageUrl(event?.stadium_image!);
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
    const allBets = [event?.bronze, event?.silver_one, event?.silver_two, event?.gold_one, event?.gold_two].filter(x => x !== null);
    const minBet = allBets.length > 0 ? Math.min(...allBets) : false;

    return (<div ref={ref}>
        <div className="share-logo">
            <IonImg src={logo} className="logo" />
        </div>
        <div className="shareable-image">
            <div className="shareable-image_title">{title}</div>
            <img className="shareable-image_image" src={image} />
            <div className="shareable-image_content">
                <div className="shareable-image_datecol">
                    <div className="shareable-image_datelabel">Event Date</div>
                    <div className="shareable-image_dateblock">
                        <div className="shareable-image_weekday">{moment(event?.event_date).format("dddd")}</div>
                        <div className="shareable-image_day">{moment(event?.event_date).format("D")}</div>
                        <div className="shareable-image_month">{moment(event?.event_date).format("MMMM")}</div>
                    </div>
                    <div className="shareable-image_year">{moment(event?.event_date).format("YYYY")}</div>
                </div>
                <div>
                    {event.type && <><div className="shareable-image_label">Marcaje</div>
                    <div className="shareable-image_redblock">{event.type}</div></>}
                    {minBet > 0 && <><div className="shareable-image_label">Amount</div>
                    <div className="shareable-image_redblock">{event?.bronze > 0 && ((event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.bronze))}
                        {(event?.silver_one > 0 && (" | " + (event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.silver_one)))}
                        {(event?.silver_two > 0 && (" & " + numberFormatter.formatToParts(event?.silver_two).find(x => x.type === "integer")?.value))}
                        {(event?.gold_one > 0 && (" | " + (event?.currency === "DOP" ? "RD" : "") + numberFormatter.format(event?.gold_one)))}
                        {(event?.gold_two > 0 && (" & " + numberFormatter.formatToParts(event?.gold_two).find(x => x.type === "integer")?.value))}</div></>}
                    <div className="shareable-image_whiteblock">
                        <div>Receiving time:</div>
                        <div className="shareable-image_blackblock">{moment(event?.receiving_time_start, "HH:mm").format("LT")} - {moment(event?.receiving_time_end, "HH:mm").format("LT")}</div>
                        <div>First Event:</div>
                        <div className="shareable-image_blackblock">{moment(event?.first_race_time, "HH:mm").format("LT")}</div>
                    </div>
                </div>
            </div>
            <div className="shareable-image_footer">GallosCLUB.com</div>
        </div>
    </div>);
});

export default ShareEventImage;
