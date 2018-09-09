import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import {AdminUserProps, AdminUserState} from "./AdminUserInterface"; 
import { Switch, Form, Input, Icon, Table, Button, Modal } from "antd";
import {BaseComponent} from "../BaseComponent";
import * as moment from "moment";

const FormItem = Form.Item;

@observer
export class AdminUser extends BaseComponent<AdminUserProps, AdminUserState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: undefined,
            user_id: undefined,
            first_name: undefined,
            last_name: undefined,
            phone: undefined,
            username: undefined,
            is_admin: undefined,
            is_active: undefined,
            password: undefined,
            created_at: undefined,
            last_login: undefined,
            modalVisible: false,
            confirmEmail: undefined
        };
        this.getUser = this.getUser.bind(this);
        this.toggleUserAdmin = this.toggleUserAdmin.bind(this);
        this.toggleUserActive = this.toggleUserActive.bind(this);
        this.handleResetPasswordSubmit = this.handleResetPasswordSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemoveAccount = this.handleRemoveAccount.bind(this);
        this.handleRemoveAccountCancel = this.handleRemoveAccountCancel.bind(this);
        this.handleRemoveAccountSubmit = this.handleRemoveAccountSubmit.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }
    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.getUser(userId);
    }

    getUser(userId: string) {
        this.appStore.dataStore.adminGetUserById(userId)
        .then((user: any) => {
            this.setState({
                email: user.email,
                username: user.username,
                is_admin: user.is_admin,
                is_active: user.is_active,
                first_name: user.first_name,
                last_name: user.last_name,
                user_id: user.user_id,
                phone: user.phone
            });
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get User"); 
        });
    }

    toggleUserAdmin() {
        const data = {
            user_id: this.state.user_id,
            is_admin: !this.state.is_admin
        };
        this.appStore.dataStore.adminUpdateUserAdmin(data)
        .then(() => {
            this.setState({is_admin: !this.state.is_admin});
            this.appStore.showMessage("success", "Successfully Updated User Admin Status");
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to Update Admin Status.");
        });
    }

    toggleUserActive() {
        const data = {
            user_id: this.state.user_id,
            is_active: !this.state.is_active
        };
        this.appStore.dataStore.adminUpdateUserActive(data)
        .then(() => {
            this.setState({is_active: !this.state.is_active});
            this.appStore.showMessage("success", "Successfully Updated User Active Status");
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to Update Admin Status.");
        });
    }

    handleChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    validatePassword(password: string | undefined) {
        const validPassword = this.appStore.validatePassword(password);

        if (validPassword)
            return true;
        else
            this.appStore.showMessage("error", "Please enter a valid Password");
        return false;
    }

    handleResetPasswordSubmit() {
        const data = {
            user_id: this.state.user_id,
            password: this.state.password
        };
        if (this.validatePassword(data.password))
            this.appStore.dataStore.adminResetUserPassword(data)
            .then(() => {
                this.setState({password: undefined});
                this.appStore.showMessage("success", "Successfully Updated User Password");
            })
            .catch((err: any) => {
                console.error(err);
                this.appStore.showMessage("error", "Something went wrong. Unable to Update Admin Status.");
            });
    }

    handleRemoveAccount = (e: any) => {
        e.preventDefault();
        this.setState({modalVisible: true});
    }

    handleRemoveAccountCancel = (e: any) => {
        e.preventDefault();
        this.setState({modalVisible: false});
    }

    handleRemoveAccountSubmit = (e: any) => {
        e.preventDefault();
        if (this.state.confirmEmail === this.state.email) {
            const userData = {
                user_id: this.state.user_id
            };
            const {appStore} = this;
            appStore.dataStore.adminDeleteUser(userData)
            .then(() => {
                this.setState({modalVisible: false});
                this.appStore.navigateTo("/admin/users");
                this.appStore.showMessage("success", "Account Successfully Deleted.");
            })
            .catch((err: any) => {

            });
        } else {
            this.appStore.showMessage("error", "Email address does not match. Please try again.");
        }
    }

    render() {

        const columns = [
            {
                title: "Date / Time",
                dataIndex: "timestamp",
                key: "timestamp"
            },
            {
                title: "Activity",
                dataIndex: "activity_text",
                key: "activity_text",
            }
        ];

        return(
            <Observer>
            {() => 
                <>
                    <div className="sb_admin-user__content-container">
                        <div className="sb_admin-user__personal-info-container">
                            <h3 className="sb_admin-user__personal-info-header">Personal Information</h3>
                            <h5> Email: <span className="sb_admin-user__content">{this.state.email}</span></h5>
                            <h5>ID: <span className="sb_admin-user__content">{this.state.user_id}</span> </h5>
                            <h5>Name: <span className="sb_admin-user__content">{this.state.first_name} {this.state.last_name}</span></h5>
                            <h5>Username: <span className="sb_admin-user__content">{this.state.username}</span> </h5>
                            <h5>Phone: <span className="sb_admin-user__content">{this.state.phone}</span></h5>
                            <h5>Account Created: <span className="sb_admin-user__content">{moment(this.state.created_at).format("llll")}</span> </h5>
                            <h5>Last Login: <span className="sb_admin-user__content">{moment(this.state.last_login).format("llll")}</span> </h5>
                            <h3 className="sb_admin-user__status-header">Status / Permissions</h3>
                            <h5>Admin: <span className="sb_admin-user__content">{this.state.is_admin ? <Switch checked={true} onChange={this.toggleUserAdmin} /> : <Switch checked={false} onChange={this.toggleUserAdmin}/>}</span> </h5> 
                            <h5>Active: <span className="sb_admin-user__content">{this.state.is_active ? <Switch checked={true} onChange={this.toggleUserActive} /> : <Switch checked={false} onChange={this.toggleUserActive}/>}</span></h5>
                            <h3 className="sb_admin-user__password-header" >Password Reset</h3>
                            <Form> 
                                <FormItem 
                                className="sb_admin-user__password-reset"
                                label="Reset Password"
                                help="Must contain a Capital Letter, Number, Special Character (!@#$%&*?|) and be atleast 8 characters long." >
                                    <Input 
                                        prefix={<Icon type="key" />} 
                                        placeholder="Reset Password" 
                                        type="password"
                                        onChange={this.handleChange} 
                                        value={this.state.password} 
                                        name="password" />
                                </FormItem>
                                <FormItem
                                    className="sb_admin-user__reset-password-button">
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        onClick={this.handleResetPasswordSubmit}>
                                        Reset Password
                                    </Button>
                                </FormItem>
                            </Form>
                            <Form> 
                                <FormItem className="sb_admin-user__remove-account-button">
                                    <Button 
                                        // onClick={this.handleRemoveAccount}
                                        type="danger" 
                                        htmlType="submit"
                                        onClick={this.handleRemoveAccount}>
                                        DELETE ACCOUNT
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div className="sb_admin-user__activity-container">
                            <h3> User Activity</h3>
                            <Table 
                                className="sb_admin-user__activity-table"
                                pagination={false}
                                columns={columns}/>
                        </div>
                    </div>
                    <Modal
                    title="DELETE ACCOUNT CONFIRMATION"
                    visible={this.state.modalVisible}
                    footer={[
                        <Button key="back" onClick={this.handleRemoveAccountCancel}>CANCEL</Button>,
                        <Button key="submit" type="danger" onClick={this.handleRemoveAccountSubmit}>
                        DELETE
                        </Button>,
                    ]}
                    >
                        <Form onSubmit={this.handleRemoveAccountSubmit} name="removeAccount" className="login-form">
                            <FormItem 
                                label="Confirm Email: "
                                className="sb_profile__input">
                                <Input 
                                    onChange={this.handleChange} 
                                    value={this.state.confirmEmail} 
                                    name="confirmEmail" 
                                    placeholder="Confirm Email Address" />
                            </FormItem>
                        </Form>
                    </Modal>
                </>
                }  
            </Observer>
        );
    }
}