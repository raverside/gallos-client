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
    const {dispatch} = useContext(AppContext);
    const appPages: { [key: string]: AppPage[] } = {};
    const history = useHistory();

    appPages["user"] = [
        {title: 'Home', url: '/', icon: homeIcon},
        {title: 'Membership', url: '/user_membership', icon: membershipsIcon},
        {title: 'Contact Us', url: '/contact', icon: contactIcon},
        {
            title: 'Log Out', url: '/auth', icon: logoutIcon,
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
        {title: 'Events', url: '/', icon: eventsIcon},
        {title: 'Contact Us', url: '/contact', icon: contactIcon},
        {
            title: 'Log Out', url: '/auth_admin', icon: logoutIcon,
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
        {title: 'Events', url: '/events', icon: eventsIcon},
        {title: 'Teams', url: '/team_owners', icon: teamOwnersIcon},
        {title: 'Contact Us', url: '/contact', icon: contactIcon},
        {
            title: 'Log Out', url: '/auth_admin', icon: logoutIcon,
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
        {title: 'Users', url: '/users', icon: usersIcon},
        {title: 'Events', url: '/events', icon: eventsIcon},
        {title: 'Stadiums', url: '/stadiums', icon: stadiumsIcon},
        {title: 'Team Owners', url: '/team_owners', icon: teamOwnersIcon},
        {title: 'Memberships', url: '/memberships', icon: membershipsIcon},
        {
            title: 'Log Out', url: '/auth_admin', icon: logoutIcon,
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
        {title: 'Users', url: '/users', icon: usersIcon},
        {title: 'Events', url: '/events', icon: eventsIcon},
        {title: 'Stadiums', url: '/stadiums', icon: stadiumsIcon},
        {title: 'Team Owners', url: '/team_owners', icon: teamOwnersIcon},
        {title: 'Transactions', url: '/transactions', icon: transactionsIcon},
        {title: 'Memberships', url: '/memberships', icon: membershipsIcon},
        {
            title: 'Log Out', url: '/auth_admin', icon: logoutIcon,
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
            title: 'Log Out', url: '/auth_admin', icon: logoutIcon,
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
