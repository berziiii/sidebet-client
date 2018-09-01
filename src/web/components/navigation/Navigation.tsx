import * as React from "react";
import * as _ from "lodash";
import { Menu, Icon, Button } from "antd";
import { Link } from "react-router-dom";
import {NavigationProps, NavigationState} from "./NavigationInterface"; 
import {BaseComponent} from "../BaseComponent";
import {AppStore} from "../../stores/AppStore";

export class Navigation extends BaseComponent<NavigationProps, NavigationState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: "home", 
            collapsed: true,
        };
        this.setActiveTab = this.setActiveTab.bind(this);
    }

    componentWillMount() {
        this.setActiveTab();
    }

    setActiveTab() {
        const url = AppStore.location.pathname;
        if (url === "/") 
            this.setState({activeTab: "home"}); 
        else if (url === "/signin")
            this.setState({activeTab: "signin"}); 
    }

    render() {
        return (
            <Menu
                defaultSelectedKeys={[this.state.activeTab]}
                mode="inline"
                theme="dark">
                <Button 
                className="sb_navigation__menu-button"
                size="large" 
                onClick={this.props.toggle}>
                    <Icon
                    className="trigger"
                    type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
                    />
                </Button>
                <Menu.Item key="home">
                    <Link to="/">
                        <Icon type="home" />
                        <span> Home </span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="signin">
                    <Link to="/signin">
                        <Icon type="login" />
                        <span> Login </span>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}