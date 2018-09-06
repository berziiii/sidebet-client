import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import { Layout } from "antd";
import {AdminUsersProps, AdminUsersState} from "./AdminUsersInterface";
import {BaseComponent} from "../../../components/BaseComponent";

const { Content } = Layout;

export class AdminUsers extends BaseComponent<AdminUsersProps, AdminUsersState> {
    constructor(props: AdminUsersProps) {
        super(props);
    }
    render() {
        return(
            <Observer> 
                {() => 
                    <>
                    <Layout>  
                        <Content className="sb_app__main-container">
                            <div className="sb_app__component-container">
                                <h1> This is Admin Users. </h1>
                            </div>
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }
}   