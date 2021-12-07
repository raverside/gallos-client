import {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonRefresher, IonRefresherContent, IonSearchbar,
    IonButton, IonIcon, IonModal
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useEffect, useState} from "react";
import {getUsers} from "../api/Users";
import UsersList from "../components/Users/UsersList";
import UsersFilter from "../components/Users/UsersFilter";
import {filter as filterIcon} from 'ionicons/icons';

import './Users.css';
import {useTranslation} from "react-multi-lang";

const Users: React.FC = () => {
    const t = useTranslation();
    const [users, setUsers] = useState<Array<{id:string}>>([]);
    const [infiniteScrollPage, setInfiniteScrollPage] = useState<number>(1);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [usersFilter, setUsersFilter] = useState<any>({});
    const [usersFilterQuery, setUsersFilterQuery] = useState<string>("");
    const [usersSearch, setUsersSearch] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (filter = usersFilterQuery, callback = () => {}) => {
        const response = await getUsers(filter, 0);
        if (response.users) {
            setUsers(response.users);
            setInfiniteScrollPage(1);
        }
        setDisableInfiniteScroll(response.users?.length < 10);
        callback();
    }

    const searchNext = async ($event: CustomEvent<void>) => {
        const response = await getUsers(usersFilterQuery, infiniteScrollPage);
        if (response.users?.length > 0) {
            setUsers([...users, ...response.users]);
            setInfiniteScrollPage(infiniteScrollPage + 1);
            setDisableInfiniteScroll(response.users.length < 10);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    const updateFilter = (search = usersSearch, filter = usersFilter) => {
        let filterQuery = "";
        if (search) {
            filterQuery += "&search="+search;
        }
        if (filter.country) {
            filterQuery += "&country="+filter.country;
        }
        if (filter.state) {
            filterQuery += "&state="+filter.state;
        }
        if (filter.city) {
            filterQuery += "&city="+filter.city;
        }
        if (filter.membership) {
            filterQuery += "&membership="+filter.membership;
        }
        if (filter.sort) {
            filterQuery += "&sort="+filter.sort;
        }
        setUsersFilterQuery(filterQuery);
        fetchUsers(filterQuery);
    }

    return (
        <IonPage>
            <Header title={t('users.users')} isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
                    <UsersFilter filter={usersFilter} setFilter={(filter) => {setUsersFilter(filter); updateFilter(usersSearch, filter)}} close={() => setShowFilterModal(false)}/>
                </IonModal>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchUsers(usersFilterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                <div className="search-filter-block">
                    <IonSearchbar className="searchbar" placeholder={t('users.search')} value={usersSearch} onIonChange={e => {setUsersSearch(e.detail.value!); updateFilter(e.detail.value!);}} />
                    <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                        <IonIcon icon={filterIcon} color="dark" />
                    </IonButton>
                </div>

                <UsersList users={users} />
                <IonInfiniteScroll disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default Users;
