import {
    IonText,
    IonButton,
    IonModal, IonIcon,
} from '@ionic/react';
import React, {useState} from 'react';
import moment from 'moment';
import Calendar from 'react-calendar';

import './DateFilter.css';
import {calendarOutline as calendarIcon} from "ionicons/icons";
import {useTranslation} from "react-multi-lang";

type FilterProps = {
    filter: any;
    setFilter: (filter:string) => void;
    updateFilter: (filter:string) => void;
};

const DateFilter: React.FC<FilterProps> = ({filter, setFilter, updateFilter}) => {
    const t = useTranslation();
    const [dateFilter, setDateFilter] = useState<Date>(new Date());
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const Submit = () => {
        const newFilter = moment(dateFilter).format("YYYY-MM-DD");
        setFilter(newFilter);
        updateFilter(newFilter);
        setShowFilterModal(false);
    }

    return (<>
        <div className="datepicker-block">
            <IonText className="datepicker-current-date">{filter ? moment(filter).format("D MMMM YYYY") : moment().format("D MMMM YYYY")}</IonText>
            <IonButton fill="clear" color="dark" className="calendar-button" onClick={() => setShowFilterModal(true)}>{t('events.calendar')} <IonIcon slot="end" icon={calendarIcon} size="medium" /></IonButton>
        </div>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="datepicker-filter-form">
                <Calendar
                    value={dateFilter}
                    onChange={(value:Date) => setDateFilter(value)}
                    minDetail="month"
                />
                <IonButton expand="block" onClick={Submit}>{t('general.calendar_select')}</IonButton>
            </form>
        </IonModal>
    </>);
};

export default DateFilter;
