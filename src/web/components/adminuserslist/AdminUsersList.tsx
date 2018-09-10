import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import {AdminUsersListProps, AdminUsersListState} from "./AdminUsersListInterface"; 
import { Table, Button, Icon } from "antd";
import {BaseComponent} from "../BaseComponent";

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
                title: "Full Name",
                dataIndex: "fullname",
                key: "fullname",
                render: (text: any, row: any, index: any) => {
                    return `${row.first_name} ${row.last_name}`;
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
                                className="sb_admin-users__view-user" 
                                shape="circle">
                                <Icon type="eye" />
                            </Button> );
                }
            }
        ];
        return(
            <Observer>
            {() =>
                <div className="sb_admin-users__main-container">
                    <h1 className="sb_admin-users__header">Users</h1>
                    <Table 
                        className="sb_admin-users__users-table"
                        pagination={false}
                        dataSource={this.props.users} 
                        columns={columns}/>
                    </div>}
            </Observer>
        );
    }
}