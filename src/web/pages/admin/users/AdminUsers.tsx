import * as _ from "lodash";
import * as React from "react";
import {Observer, observer} from "mobx-react";
import { Layout } from "antd";
import {AdminUsersProps, AdminUsersState} from "./AdminUsersInterface";
import {BaseComponent} from "../../../components/BaseComponent";
import * as ComponentFactory from "../../../components/ComponentFactory";

const { Content } = Layout;

@observer
export class AdminUsers extends BaseComponent<AdminUsersProps, AdminUsersState> {
    constructor(props: AdminUsersProps) {
        super(props);
        this.state = {
            users: [],
            loading: true,
        };
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    componentDidMount() {
        if (this.state.users.length === 0)
            this.getAllUsers();
    }

    getAllUsers() {
        this.appStore.dataStore.adminGetAllUsers()
        .then((users: AdminUsersProps) => {
            this.setState({
                loading: false,
                users: users
            });
        })
        .catch((err) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get Users");
        });
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
                            <ComponentFactory.AdminUsersList users={this.state.users} />}
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }
}   