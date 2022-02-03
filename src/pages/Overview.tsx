import {
    IonContent,
    IonPage,
    IonIcon,
    IonText
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useState, useContext, useEffect} from "react";

import './Overview.css';
import {arrowUpOutline as UpIcon, arrowDownOutline as DownIcon} from "ionicons/icons";
import {getOverviewInfo} from '../api/Overview';
import {AppContext} from "../State";
import {useTranslation} from "react-multi-lang";
import moment from "moment";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {useHistory} from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Overview: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const history = useHistory();
    const [data, setData] = useState<any>();
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});
    const chartLine:any = [];
    for(let day = 7; day > 0; day--) {
        chartLine.push([moment().subtract(day, 'days').format('DD/MM'), 0]);
    }
    const membershipSalesChart = {
        labels: chartLine.map((cL:any) => cL[0]),
        datasets: [{
            data: chartLine.map((cL:any) => cL[1]),
        }]
    };
    const totalUsersChart = {
        labels: ['Gold', 'Silver', 'Expired'],
        datasets: [
            {
                label: t('overview.total_users'),
                data: [0, 0, data?.users.total],
                backgroundColor: [
                    '#FCB808',
                    '#D9D9D9',
                    '#6A6A6A'
                ],
            },
        ],
    };
    const totalStadiumsChart = {
        labels: ['Gold', 'Silver', 'Expired'],
        datasets: [
            {
                label: t('overview.total_stadiums'),
                data: [data?.stadiums.total, 0, 0],
                backgroundColor: [
                    '#FCB808',
                    '#D9D9D9',
                    '#6A6A6A'
                ],
            },
        ],
    };
    const totalEventsChart = {
        labels: ['Gold', 'Silver'],
        datasets: [
            {
                label: t('overview.total_events'),
                data: [data?.events.total, 0],
                backgroundColor: [
                    '#FCB808',
                    '#D9D9D9',
                ],
            },
        ],
    };

    useEffect(() => {
        if (state.user.role !== 'admin') history.replace('/');
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await getOverviewInfo();
        if (response) {
            setData(response);
        }
    }

    return (
        <IonPage>
            <Header title={t('overview.overview')} isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <div className="overview_wrapper">
                    <div className="overview_label">{t('overview.total_transactions')}</div>
                    <div className="overview_value">{numberFormatter.format(data?.total_transactions)}</div>

                    <div className="overview_label">{t('overview.active_memberships')}</div>
                    <div className="overview_value">{data?.active_memberships}</div>

                    <div className="overview_label">{t('overview.today')} <span className="overview_today-date">{moment().format('DD MMM YYYY')}</span></div>
                    <div className="overview_today-blocks">
                        <div className="overview_today-block">
                            <div>${data?.today.amount}</div>
                            <span>{t('overview.amount')}</span>
                        </div>
                        <div className="overview_today-block">
                            <div>{data?.today.payments}</div>
                            <span>{t('overview.payments')}</span>
                        </div>
                        <div className="overview_today-block">
                            <div>{data?.today.memberships}</div>
                            <span>{t('overview.memberships')}</span>
                        </div>
                    </div>

                    <div className="overview_label">{t('overview.membership_sales')}</div>
                    <div className="chart_wrapper"><Line data={membershipSalesChart} options={{elements: {line: {borderColor: "#EB0404"}}, plugins: {legend: {display:false}}, scales: {y:  {min: 0, ticks: {stepSize: 1}}}}}/></div>

                    <div className="overview_label">{t('overview.new_users')}</div>
                    <div className="overview_value">{data?.users.this_week}</div>
                    {(data?.users.this_week > data?.users.last_week && data?.users.last_week > 0) && <div className="overview_conversion"><IonText color="success"><IonIcon icon={UpIcon}/> {Math.round((data.users.this_week / data.users.last_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}
                    {(data?.users.this_week < data?.users.last_week && data?.users.this_week > 0) && <div className="overview_conversion"><IonText color="primary"><IonIcon icon={DownIcon}/> {Math.round((data.users.last_week / data.users.this_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}

                    <div className="overview_label">{t('overview.total_users')}</div>
                    <div className="overview_value">{data?.users.total}</div>
                    <div className="overview_doughnut_wrapper"><Doughnut data={totalUsersChart} options={{plugins: {legend: {position:'right', labels: {boxWidth:12, boxHeight:12}}}}} /></div>

                    <div className="overview_label">{t('overview.total_stadiums')}</div>
                    <div className="overview_value">{data?.stadiums.total}</div>
                    <div className="overview_doughnut_wrapper"><Doughnut data={totalStadiumsChart} options={{plugins: {legend: {position:'right', labels: {boxWidth:12, boxHeight:12}}}}} /></div>

                    <div className="overview_total_teams">
                        <div>
                            <div className="overview_label">{t('overview.total_team_owners')}</div>
                            <div className="overview_value">{data?.team_owners.team_owners}</div>
                        </div>
                        <div>
                            <div className="overview_label">{t('overview.total_teams')}</div>
                            <div className="overview_value">{data?.team_owners.teams}</div>
                        </div>
                    </div>

                    <div className="overview_label">{t('overview.daily_team_creation')}</div>
                    <div className="overview_value">{(data?.team_owners.this_week > 0) ? (data?.team_owners.this_week / 7).toFixed(2) : 0}</div>
                    {(data?.team_owners.this_week > data?.team_owners.last_week && data?.team_owners.last_week > 0) && <div className="overview_conversion"><IonText color="success"><IonIcon icon={UpIcon}/> {Math.round((data.team_owners.this_week / data.team_owners.last_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}
                    {(data?.team_owners.this_week < data?.team_owners.last_week && data?.team_owners.this_week > 0) && <div className="overview_conversion"><IonText color="primary"><IonIcon icon={DownIcon}/> {Math.round((data.team_owners.last_week / data.team_owners.this_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}

                    <div className="overview_label">{t('overview.total_events')}</div>
                    <div className="overview_value">{data?.events.total}</div>
                    <div className="overview_doughnut_wrapper"><Doughnut data={totalEventsChart} options={{plugins: {legend: {position:'right', labels: {boxWidth:12, boxHeight:12}}}}} /></div>

                    <div className="overview_label">{t('overview.daily_event_creation')}</div>
                    <div className="overview_value">{(data?.events.this_week > 0) ? (data?.events.this_week / 7).toFixed(2) : 0}</div>
                    {(data?.events.this_week > data?.events.last_week && data?.events.last_week > 0) && <div className="overview_conversion"><IonText color="success"><IonIcon icon={UpIcon}/> {Math.round((data.events.this_week / data.events.last_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}
                    {(data?.events.this_week < data?.events.last_week && data?.events.this_week > 0) && <div className="overview_conversion"><IonText color="primary"><IonIcon icon={DownIcon}/> {Math.round((data.events.last_week / data.events.this_week) * 100)}%</IonText> {t('overview.from_last_week')}</div>}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Overview;
