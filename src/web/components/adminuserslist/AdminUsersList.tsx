import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import {AdminUsersListProps, AdminUsersListState} from "./AdminUsersListInterface"; 
import { Table, Button, Icon } from "antd";
import {BaseComponent} from "../BaseComponent";
import * as moment from "moment";

@observer
export class AdminUsersList extends BaseComponent<AdminUsersListProps, AdminUsersListState> {
    constructor(props: any) {
        super(props);
        this.handleEditUserClick = this.handleEditUserClick.bind(this);
    }

    handleEditUserClick(user: any) {
        this.appStore.navigateTo(`/admin/users/${user.user_id}`);
        // const data = {
        //     user_id: user.user_id,
        //     is_admin: !user.is_admin
        // };
        // this.appStore.dataStore.adminUpdateUserAdmin(data)
        // .then((res) => {
        //     debugger;
        //     this.setState({hasUpdate: true});
        // })
        // .catch((err) => {
        //     console.error(err);
        //     this.appStore.showMessage("error", "Something went wrong. Unable to Update Admin Status.");
        // });
    }

    render() {
        const columns = [
            {
                title: "Email",
                dataIndex: "email",
                key: "email"
            },
            {
                title: "Username",
                dataIndex: "username",
                key: "username"
            },
            {
                title: "First Name",
                dataIndex: "first_name",
                key: "first_name"
            },
            {
                title: "Last Name",
                dataIndex: "last_name",
                key: "last_name"
            },
            {
                title: "Username",
                dataIndex: "username",
                key: "username"
            },
            {
                title: "Last Login",
                dataIndex: "last_login",
                key: "last_login",
                render: (text: any, row: any, index: any) => {
                    return moment(row.last_login).format("llll");
                }
            },
            {
                title: "Account Created",
                dataIndex: "created_at",
                key: "created_at",
                render: (text: any, row: any, index: any) => {
                    return moment(row.created_at).format("llll");
                }
            },
            {
                title: "Admin",
                dataIndex: "is_admin",
                key: "is_admin",
                render: (text: any, row: any, index: any) => {
                    if (row.is_admin) 
                        return (<Icon className="sb_admin-users__check-circle" type="check-circle"/>);
                    return (<Icon className="sb_admin-users__close-circle" type="close-circle" />);
                }
            },
            {
                title: "Active",
                dataIndex: "is_admin",
                key: "is_admin",
                render: (text: any, row: any, index: any) => {
                    if (row.is_active) 
                        return (<Icon className="sb_admin-users__check-circle" type="check-circle"/>);
                    return (<Icon className="sb_admin-users__close-circle" type="close-circle" />);
                }
            },
            {
                title: "",
                dataIndex: "",
                key: "",
                render: (text: any, row: any, index: any) => {
                    return ( <Button 
                                onClick={() => this.handleEditUserClick(row)}
                                className="sb_admin-users__edit-user" 
                                shape="circle">
                                <Icon type="edit"/>
                            </Button> );
                }
            }
        ];
        return(
            <Observer>
            {() => 
                <Table 
                    className="sb_admin-users__users-table"
                    pagination={false}
                    dataSource={this.props.users} 
                    columns={columns}
                    scroll={{ x: 1200 }}/>}
            </Observer>
        );
    }
}