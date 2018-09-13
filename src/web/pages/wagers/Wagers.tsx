import * as _ from "lodash";
import * as React from "react";
import {Observer, observer} from "mobx-react";
import { Layout } from "antd";
import * as ComponentFactory from "../../components/ComponentFactory";
import {BaseComponent} from "../../components/BaseComponent";

const {Content} = Layout;

@observer
export class Wagers extends BaseComponent {
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        if (_.isNil(this.appStore.dataStore.authorizedUser))
            this.appStore.navigateTo("/signin");
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
                            <ComponentFactory.WagersList />
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }  
}   