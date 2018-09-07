import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import {AdminUserProps, AdminUserState} from "./AdminUserInterface"; 
// import { Table, Button, Icon } from "antd";
import {BaseComponent} from "../BaseComponent";
// import * as moment from "moment";

@observer
export class AdminUser extends BaseComponent<AdminUserProps, AdminUserState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: undefined
        };
        // this.getUser = this.getUser.bind(this);
    }
    componentDidMount() {
        // if (_.isNil(this.state.user)) {
            const userId = this.props.match.params.userId;
            this.getUser(userId);
        // }
    }

    getUser(userId: string) {
        this.appStore.dataStore.adminGetUserById(userId)
        .then((user: any) => {
            this.setState({username: user.username});
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get User"); 
        });
    }

    render() {
        return(
            <Observer>
            {() => 
                <>
                    <h1>Admin User Page</h1>
                    {this.state.username}
                </>
                }  
            </Observer>
        );
    }
}