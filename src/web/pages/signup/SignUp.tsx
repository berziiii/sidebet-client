import * as _ from "lodash";
import * as React from "react";
import {Observer, observer} from "mobx-react";
import { Layout } from "antd";
import * as ComponentFactory from "../../components/ComponentFactory";
import {BaseComponent} from "../../components/BaseComponent";

const {Content} = Layout;

@observer
export class SignUp extends BaseComponent {
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
                            <ComponentFactory.SignUpForm />
                        </Content>
                    </Layout>
                    </>}
            </Observer>
        );
    }  
}   