import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Menu, Icon, Button } from "antd";
import {NavigationProps, NavigationState} from "./NavigationInterface"; 
import {BaseComponent} from "../BaseComponent";

export class Navigation extends BaseComponent<NavigationProps, NavigationState> {
    constructor(props: any) {
        super(props);
        this.state = {
            collapsed: true,
        };
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        this.appStore.checkAuthenticatedRoute();
    }

    handleNavClick(path: string) {
        this.appStore.navigateTo(path);
    }

    handleLogout() {
        this.appStore.dataStore.storage.clear()
        .then(() => {
            this.setState({validUser: false});
            this.appStore.dataStore.clearUserAndToken();
            this.appStore.navigateTo("/signin");
            this.appStore.showMessage("success", "Successfully Logged Out.");
        })
        .catch((err) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }
    render() {
        const avatar = () => {
            let initial;
            if (!_.isNil(this.appStore.dataStore.authorizedUser.first_name))
                 initial = this.appStore.dataStore.authorizedUser.first_name.charAt(0).toUpperCase();
            return(
                <>
                    {!_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                    <Button 
                        className="sb_navigation__avatar"
                        onClick={() => this.handleNavClick("/profile")}>
                        {initial}
                    </Button>}
                    {_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                        <Button 
                        className="sb_navigation__avatar"
                        onClick={() => this.handleNavClick("/profile")}>U</Button>}
                </>
            );
        };
        return (
            <Observer>
                {() => 
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
                }      
            </Observer>
        );
    }
}