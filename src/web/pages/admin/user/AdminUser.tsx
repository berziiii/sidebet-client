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
        this.state = {
            user: undefined,
            loading: true,
        };
        // this.getAllUsers = this.getAllUsers.bind(this);
    }

    componentDidMount() {
        if (_.isNil(this.state.user))
            this.getUser();
    }

    getUser() {
        // this.appStore.dataStore.adminGetAllUsers()
        // .then((users: AdminUserProps) => {
        //     this.setState({
        //         loading: false,
        //         users: users
        //     });
        // })
        // .catch((err) => {
        //     console.error(err);
        //     this.appStore.showMessage("error", "Something went wrong. Unable to get Users");
        // });
    }

    render() {
        return(
            <Observer> 
                {() => 
                    <>
                    <Layout>  
                        <Content className="sb_app__main-container">
                            {this.state.loading &&
                            <ComponentFactory.Loading />}
                            {!this.state.loading && 
                            <ComponentFactory.AdminUser props={this} />}
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }
}   