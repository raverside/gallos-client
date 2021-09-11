import {
    IonText,
    IonButton,
    IonModal, IonIcon,
    IonSegment, IonSegmentButton
} from '@ionic/react';
import React, {useState} from 'react';
import moment from 'moment';
import Calendar from 'react-calendar';

import './DateFilter.css';
import {calendarOutline as calendarIcon} from "ionicons/icons";

type FilterProps = {
    eventDates: any;
    filter: any;
    setFilter: (filter:string) => void;
    updateFilter: (filter:string) => void;
};

const DateFilter: React.FC<FilterProps> = ({filter, setFilter, updateFilter, eventDates}) => {
    const [dateFilter, setDateFilter] = useState<Date>(new Date());
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const upcomingDays:any = [];
    for (let i = 1; i <= 10; i++) {
        const nextDay = moment().add(i, 'days');
        upcomingDays.push({
            weekDay: nextDay.format('ddd'),
            day: nextDay.format('MMM DD'),
            date: nextDay.format('YYYY-MM-DD'),
            hasEvent: eventDates.find((ed:any) => ed.date === nextDay.format('YYYY-MM-DD'))
        })
    }

    const Submit = () => {
        const newFilter = moment(dateFilter).format("YYYY-MM-DD");
        setFilter(newFilter);
        updateFilter(newFilter);
        setShowFilterModal(false);
    }

    return (<>
        <div className="datepicker-block">
            <IonText className="datepicker-current-date">{moment().format("D MMMM YYYY")}</IonText>
            <IonButton fill="clear" color="dark" onClick={() => setShowFilterModal(true)}><IonIcon slot="icon-only" icon={calendarIcon} size="medium" /></IonButton>
        </div>
        <IonSegment scrollable value={filter} className="datepicker-shortcuts">
            {upcomingDays.map((day:any) => <IonSegmentButton key={day.date} value={day.date} onClick={() => { setFilter(day.date);updateFilter(day.date) }} className="datepicker-shortcut">
                <div className="datepicker-shortcut-week">{day.weekDay}</div>
                <div className="datepicker-shortcut-day">{day.day}</div>
                {day.hasEvent && <div className="datepicker-shortcut-hasEvent">•</div>}
            </IonSegmentButton>)}
        </IonSegment>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="datepicker-filter-form">
                <Calendar value={dateFilter} onChange={(value:Date) => setDateFilter(value)}/>
                <IonButton expand="block" onClick={Submit}>Select</IonButton>
            </form>
        </IonModal>
    </>);
};

export default DateFilter;
