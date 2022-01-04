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
import {useTranslation} from "react-multi-lang";

type FilterProps = {
    eventDates: any;
    filter: any;
    setFilter: (filter:string) => void;
    updateFilter: (filter:string) => void;
};

const DateFilter: React.FC<FilterProps> = ({filter, setFilter, updateFilter, eventDates}) => {
    const t = useTranslation();
    const [dateFilter, setDateFilter] = useState<Date>(new Date());
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const upcomingDays:any = [];
    for (let i = -3; i <= 10; i++) {
        const nextDay = (filter && moment(filter).isValid()) ? moment(filter).add(i, 'days') : moment().add(i, 'days');
        upcomingDays.push({
            weekDay: nextDay.format('ddd'),
            day: nextDay.format('DD MMM'),
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
            <IonText className="datepicker-current-date">{(filter && moment(filter).isValid()) ? moment(filter).format("D MMMM YYYY") : moment().format("D MMMM YYYY")}</IonText>
            <IonButton fill="clear" color="dark" className="calendar-button" onClick={() => setShowFilterModal(true)}>{t('events.calendar')} <IonIcon slot="end" icon={calendarIcon} size="medium" /></IonButton>
        </div>
        <IonSegment scrollable value={filter} className="datepicker-shortcuts">
            {upcomingDays.map((day:any) => <IonSegmentButton key={day.date} value={day.date} onClick={() => {
                setDateFilter(new Date(day.date));
                setFilter(day.date);
                updateFilter(day.date);
            }} className="datepicker-shortcut">
                <div className="datepicker-shortcut-week">{day.weekDay}</div>
                <div className="datepicker-shortcut-day">{day.day}</div>
                {day.hasEvent && <div className="datepicker-shortcut-hasEvent">•</div>}
            </IonSegmentButton>)}
        </IonSegment>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="datepicker-filter-form">
                <Calendar
                    value={dateFilter}
                    onChange={(value:Date) => setDateFilter(value)}
                    minDetail="month"
                    tileContent={({date, view}) => {
                        if (view === 'month' && eventDates.find((ed:any) => ed.date === moment(date).format('YYYY-MM-DD'))){
                            return <div className="datepicker-shortcut-hasEvent">•</div>;
                        }
                        return null;
                    }}
                />
                <IonButton expand="block" onClick={Submit}>{t('general.select')}</IonButton>
            </form>
        </IonModal>
    </>);
};

export default DateFilter;
