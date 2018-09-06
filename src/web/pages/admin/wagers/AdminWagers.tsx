import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import { Layout } from "antd";
import {AdminWagersProps, AdminWagersState} from "./AdminWagersInterface";
import {BaseComponent} from "../../../components/BaseComponent";

const { Content } = Layout;

export class AdminWagers extends BaseComponent<AdminWagersProps, AdminWagersState> {
    constructor(props: AdminWagersProps) {
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
                            <h1> This is Admin Wagers. </h1>
                        </div>
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }
}   