import * as React from "react";
import * as _ from "lodash";
import { Observer, observer } from "mobx-react";
import { Menu, Icon, Button, Layout, Drawer } from "antd";
import {AppMode} from "../../stores/AppStore";
import {NavigationProps, NavigationState} from "./NavigationInterface"; 
import {BaseComponent} from "../BaseComponent";

const { Header } = Layout;

@observer
export class Navigation extends BaseComponent<NavigationProps, NavigationState> {
    constructor(props: any) {
        super(props);
        this.state = {
            drawerVisible: false,
        };
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
    }

    componentDidMount() {
        this.appStore.checkAuthenticatedRoute();
    }

    handleNavClick(path: string) {
        this.appStore.navigateTo(path);
        if (this.appStore.state.mode === AppMode.Mobile) {
            this.setState({drawerVisible: false});
        }
    }

    handleLogout() {
        this.appStore.dataStore.storage.clear()
        .then(() => {
            this.appStore.dataStore.clearUserAndToken();
            this.appStore.navigateTo("/signin");
            this.appStore.showMessage("success", "Successfully Logged Out.");
            if (this.appStore.state.mode === AppMode.Mobile) {
                this.setState({drawerVisible: false});
            }
        })
        .catch((err) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    }

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    }

    render() {
        const avatar = () => {
            let initial;
            let username;
            if (!_.isNil(this.appStore.dataStore.authorizedUser.username) && this.appStore.dataStore.authorizedUser.username.length > 10)
                username = `${this.appStore.dataStore.authorizedUser.username.substring(0, 10)}...`;
            else
                username = this.appStore.dataStore.authorizedUser.username;
            if (this.appStore.dataStore.authorizedUser.first_name === "") 
                initial = "U";
            else if (!_.isNil(this.appStore.dataStore.authorizedUser.first_name))
                 initial = this.appStore.dataStore.authorizedUser.first_name.charAt(0).toUpperCase();
            return(
                <>
                    {!_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                    <Button 
                        className="sb_navigation__avatar-button"
                        onClick={() => this.handleNavClick("/profile")}>
                        <span className="sb_navigation__avatar-icon">{initial}</span><span className="sb_navigation__avatar-username">{username}</span>
                    </Button>}
                    {_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                        <Button 
                        className="sb_navigation__avatar-button"
                        onClick={() => this.handleNavClick("/profile")}>
                            <span className="sb_navigation__avatar-icon">U</span><span className="sb_navigation__avatar-username">User</span>
                        </Button>}
                </>
            );
        };

        const mobileContent = (
            <>
                <Header className="sb_navigation__header-container">
                    <Button 
                        className="sb_navigation__drawer-button"
                        onClick={this.showDrawer}>
                        <Icon type="menu-unfold" />
                    </Button>
                </Header>
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}>
                    <Menu className="sb_navigation__drawer-menu-container">
                        {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                            avatar()}
                        {!_.isNil(this.appStore.dataStore.authorizedUser) &&
                        <Menu.Item 
                            onClick={() => this.handleNavClick("/")}
                            key="home">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="trophy" />
                            <span> Wagers </span>
                        </Menu.Item>}
                        {_.isNil(this.appStore.dataStore.authorizedUser) && 
                        <Menu.Item 
                            onClick={() => this.handleNavClick("/signup")}
                            key="signup">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="user-add" />
                            <span> Sign Up </span>
                        </Menu.Item>}
                        {_.isNil(this.appStore.dataStore.authorizedUser) && 
                        <Menu.Item 
                            onClick={() => this.handleNavClick("/signin")}
                            key="signin">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="login" />
                            <span> Login </span>
                        </Menu.Item>}
                        {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        this.appStore.dataStore.authorizedUser.is_admin &&
                        <h4 className="sb_navigation__admin-break">admin</h4>}
                        {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        this.appStore.dataStore.authorizedUser.is_admin &&
                        <Menu.Item 
                            onClick={() => this.handleNavClick("/admin/users")}
                            key="adminUsers">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="team" />
                            <span> Users </span>
                        </Menu.Item>}
                        {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        this.appStore.dataStore.authorizedUser.is_admin &&
                        <Menu.Item 
                            onClick={() => this.handleNavClick("/admin/wagers")}
                            key="adminWagers">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="dashboard" />
                            <span> Wagers </span>
                        </Menu.Item>}

                        {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        <Menu.Item 
                            onClick={this.handleLogout}
                            className="sb_navigation__logout-icon"
                            key="logout">
                                <Icon 
                                className="sb_navigation__menu-icon"
                                type="logout" />
                                <span> Logout </span>
                        </Menu.Item>}
                    </Menu>
                </Drawer>
        </>
        );
        const desktopContent = (
                <Menu
                    className="sb_navigation__menu-container"
                    mode="inline"
                    theme="dark">
                    
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        avatar()}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) &&
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/")}
                        key="home">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="trophy" />
                        <span> Wagers </span>
                    </Menu.Item>}
                    {_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/signup")}
                        key="signup">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="user-add" />
                        <span> Sign Up </span>
                    </Menu.Item>}
                    {_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/signin")}
                        key="signin">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="login" />
                        <span> Login </span>
                    </Menu.Item>}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                    this.appStore.dataStore.authorizedUser.is_admin &&
                    <h4 className="sb_navigation__admin-break">admin</h4>}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                    this.appStore.dataStore.authorizedUser.is_admin &&
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/admin/users")}
                        key="adminUsers">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="team" />
                        <span> Users </span>
                    </Menu.Item>}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                    this.appStore.dataStore.authorizedUser.is_admin &&
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/admin/wagers")}
                        key="adminWagers">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="dashboard" />
                        <span> Wagers </span>
                    </Menu.Item>}

                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={this.handleLogout}
                        className="sb_navigation__logout-icon"
                        key="logout">
                            <Icon 
                            className="sb_navigation__menu-icon"
                            type="logout" />
                            <span> Logout </span>
                    </Menu.Item>}
                </Menu>  
        );

        return (
            <Observer>
                {() =>
                    <>
                        {this.appStore.state.mode === AppMode.Desktop  &&
                        desktopContent}
                        {this.appStore.state.mode === AppMode.Mobile  &&
                        mobileContent}
                    </>
                }      
            </Observer>
        );
    }
}