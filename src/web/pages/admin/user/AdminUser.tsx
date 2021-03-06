import * as _ from "lodash";
import * as React from "react";
import {Observer, observer} from "mobx-react";
import { Layout } from "antd";
import {AdminUserProps, AdminUserState} from "./AdminUserInterface";
import {BaseComponent} from "../../../components/BaseComponent";
import * as ComponentFactory from "../../../components/ComponentFactory";

const { Content } = Layout;

@observer
export class AdminUserPage extends BaseComponent<AdminUserProps, AdminUserState> {
    constructor(props: AdminUserProps) {
        super(props);
    }

    componentWillMount() {
        if (_.isNil(this.appStore.dataStore.authorizedUser))
            this.appStore.navigateTo("/signin");
    }

    componentDidMount() {
        if (_.isNil(this.appStore.dataStore.authorizedUser)) {
            this.appStore.dataStore.clearUserAndToken();
            this.appStore.navigateTo("/signin");
        }
    }

    render() {
        return(
            <Observer> 
                {() => 
                    <>
                    <Layout>  
                        <Content className="sb_app__main-container">
                            <ComponentFactory.AdminUser props={this} />
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }
}   