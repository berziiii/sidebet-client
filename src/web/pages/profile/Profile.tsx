import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import { Layout } from "antd";
import {BaseComponent} from "../../components/BaseComponent";
import * as ComponentFactory from "../../components/ComponentFactory";

const {Content} = Layout;

export class Profile extends BaseComponent {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
    }

    render() { 
        return(
            <Observer> 
                {() => 
                    <>
                    <Layout>  
                        <Content className="sb_app__main-container">
                            <ComponentFactory.ProfileForm />
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }  
}   