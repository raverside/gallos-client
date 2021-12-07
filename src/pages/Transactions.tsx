import {
    IonContent,
    IonPage,
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useEffect, useState} from "react";
import {getMemberships} from "../api/Memberships";

import './Memberships.css';
import DateFilter from "../components/Transactions/DateFilter";
import TransactionsFilter from "../components/Transactions/TransactionsFilter";
import {useTranslation} from "react-multi-lang";


const Transactions: React.FC = () => {
    const t = useTranslation();
    const [memberships, setMemberships] = useState<Array<{id:string; type:string}>>([]);
    const [dateFilter, setDateFilter] = useState<string>("" );
    const [transactionsFilter, setTransactionsFilter] = useState<any>({});
    const [transactionsSearch, setTransactionsSearch] = useState<string>("");
    const [transactionsFilterQuery, setTransactionsFilterQuery] = useState<string>("");

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async (filter = transactionsFilterQuery) => {
        const response = await getMemberships(filter);
        if (response.memberships) {
            setMemberships(response.memberships);
        }
    }

    const updateFilter = (search = transactionsSearch, filter = transactionsFilter, datefilter = dateFilter) => {
        let filterQuery = "";
        if (search) {
            filterQuery += "&search="+search;
        }
        if (filter.payment) {
            filterQuery += "&payment=" + filter.payment;
        }
        if (datefilter) {
            filterQuery += "&dateFilter="+datefilter;
        }
        setTransactionsFilterQuery(filterQuery);
        fetchMemberships(filterQuery);
    }

    return (
        <IonPage>
            <Header title={t('transactions.transactions')} isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <DateFilter
                    filter={dateFilter}
                    setFilter={(filter) => setDateFilter(filter)}
                    updateFilter={(date) => updateFilter(transactionsSearch, transactionsFilter, date)}
                />
                <TransactionsFilter
                    filter={transactionsFilter}
                    setFilter={(filter) => setTransactionsFilter(filter)}
                    search={transactionsSearch}
                    setSearch={(filter) => setTransactionsSearch(filter)}
                    updateFilter={(search, filter) => updateFilter(search, filter)}
                />
            </IonContent>
        </IonPage>
    );
};

export default Transactions;
