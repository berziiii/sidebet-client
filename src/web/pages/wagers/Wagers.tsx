import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import { Layout } from "antd";
// import * as ComponentFactory from "../../components/ComponentFactory";
import {BaseComponent} from "../../components/BaseComponent";

const {Content} = Layout;

export class Wagers extends BaseComponent {
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
                            <div className="sb_app__component-container">
                                <h1>This Is Wagers </h1>
                            </div>
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }  
}   