import {useContext} from "react";
import {AppContext} from "../../State";
import homeIcon from '../../img/menu_home.png';
import eventsIcon from '../../img/menu_events.png';
import membershipsIcon from '../../img/menu_memberships.png';
import stadiumsIcon from '../../img/menu_stadiums.png';
import teamOwnersIcon from '../../img/menu_team_owners.png';
import transactionsIcon from '../../img/menu_transactions.png';
import usersIcon from '../../img/menu_users.png';
import logoutIcon from '../../img/menu_logout.png';
import contactIcon from '../../img/phone_black.png';
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-multi-lang";

interface AppPage {
    title: string;
    url: string;
    icon?: any;
    props?: {
        className?: string;
        onClick?: () => void;
    }
}

const MenuPermissions = () => {
    const t = useTranslation();
    const {dispatch} = useContext(AppContext);
    const appPages: { [key: string]: AppPage[] } = {};
    const history = useHistory();

    appPages["user"] = [
        {title: t('general.home'), url: '/', icon: homeIcon},
        // {title: t('membership.membership'), url: '/user_membership', icon: membershipsIcon},
        {title: t('contact.header'), url: '/contact', icon: contactIcon},
        {
            title: t('general.logout'), url: '/auth', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    history.replace("/auth");
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    appPages["creator"] = [
        {title: t('events.events'), url: '/', icon: eventsIcon},
        {title:  t('contact.header'), url: '/contact', icon: contactIcon},
        {
            title: t('general.logout'), url: '/auth_admin', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    appPages["worker"] = [
        {title: t('events.events'), url: '/events', icon: eventsIcon},
        {title: t('teams.teams'), url: '/team_owners', icon: teamOwnersIcon},
        {title: t('contact.header'), url: '/contact', icon: contactIcon},
        {
            title: t('general.logout'), url: '/auth_admin', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    appPages["admin_worker"] = [
        {title: t('users.users'), url: '/users', icon: usersIcon},
        {title: t('events.events'), url: '/events', icon: eventsIcon},
        {title: t('stadiums.header'), url: '/stadiums', icon: stadiumsIcon},
        {title: t('teams.team_owners'), url: '/team_owners', icon: teamOwnersIcon},
        {title: t('membership.memberships_header'), url: '/memberships', icon: membershipsIcon},
        {
            title: t('general.logout'), url: '/auth_admin', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    appPages["admin_manager"] = [
        {title: t('users.users'), url: '/users', icon: usersIcon},
        {title: t('events.events'), url: '/events', icon: eventsIcon},
        {title: t('stadiums.header'), url: '/stadiums', icon: stadiumsIcon},
        {title: t('teams.team_owners'), url: '/team_owners', icon: teamOwnersIcon},
        {title: t('transactions.transactions'), url: '/transactions', icon: transactionsIcon},
        {title: t('membership.memberships_header'), url: '/memberships', icon: membershipsIcon},
        {
            title: t('general.logout'), url: '/auth_admin', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    appPages["judge"] = [
        {
            title: t('general.logout'), url: '/auth_admin', icon: logoutIcon,
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        }
    ];

    return appPages;
};

export default MenuPermissions;
