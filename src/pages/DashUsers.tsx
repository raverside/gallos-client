import {
    IonContent,
    IonPage,
    IonRefresher, IonRefresherContent, IonSearchbar,
    IonButton, IonIcon, IonModal, IonSegmentButton, IonLabel, IonSegment
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useEffect, useState} from "react";
import {getDashUsers} from "../api/Users";
import UserEditor from "../components/Users/UserEditor";
import UsersList from "../components/Users/UsersList";
import UsersFilter from "../components/Users/UsersFilter";
import {filter as filterIcon} from 'ionicons/icons';

import './Users.css';
import {useTranslation} from "react-multi-lang";

const DashUsers: React.FC = () => {
    const t = useTranslation();
    const [users, setUsers] = useState<Array<{id:string}>>([]);
    const [usersFilter, setUsersFilter] = useState<any>({});
    const [usersFilterQuery, setUsersFilterQuery] = useState<string>("");
    const [usersSearch, setUsersSearch] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    const [usersRoleFilter, setUsersRoleFilter] = useState<string>("admin");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (filter = usersFilterQuery, callback = () => {}) => {
        const response = await getDashUsers(filter);
        if (response.users) {
            setUsers(response.users);
        }
        callback();
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
            <Header title={t('users.dash_team')} isRed={false} notifications={false} addButton={() => setShowAddUserModal(true)}/>

            <IonContent fullscreen>
                <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
                    <UsersFilter filter={usersFilter} setFilter={(filter) => {setUsersFilter(filter); updateFilter(usersSearch, filter)}} close={() => setShowFilterModal(false)}/>
                </IonModal>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchUsers(usersFilterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>

                <IonSegment className="events-tabs" scrollable value={usersRoleFilter} onIonChange={(e) => setUsersRoleFilter(e.detail.value!)}>
                    <IonSegmentButton value="admin">
                        <IonLabel>{t('users.role_admin')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="admin_manager">
                        <IonLabel>{t('users.role_admin_manager')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="admin_worker">
                        <IonLabel>{t('users.role_admin_worker')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="stadium_admin_worker">
                        <IonLabel>{t('users.role_stadium_admin_worker')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="judge">
                        <IonLabel>{t('users.role_judge')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="creator">
                        <IonLabel>{t('users.role_creator')}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="worker">
                        <IonLabel>{t('users.role_worker')}</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <div className="search-filter-block">
                    <IonSearchbar className="searchbar" placeholder={t('users.search')} value={usersSearch} onIonChange={e => {setUsersSearch(e.detail.value!); updateFilter(e.detail.value!);}} />
                    <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                        <IonIcon icon={filterIcon} color="dark" />
                    </IonButton>
                </div>

                <UsersList users={users.filter((u:any) => u.role === usersRoleFilter)} />
                <IonModal isOpen={showAddUserModal} onDidDismiss={() => setShowAddUserModal(false)} cssClass="update-profile-modal">
                    <UserEditor close={() => {setShowAddUserModal(false); fetchUsers()}} />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default DashUsers;
