import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as _ from "lodash";
import * as React from "react";
import {Observer, Provider} from "mobx-react";
import * as ComponentFactory from "./components/ComponentFactory";
import {DataStore} from "../core/stores/DataStore";
import {AppStore} from "./stores/AppStore";
import { Layout } from "antd";

const { Content, Sider } = Layout;

export interface AppProps {
    config?: any;
    locale?: string;
    showHeader?: boolean;
}

export interface AppState {
    collapsed: any;
    activeNavTab?: any;
    isLoading?: any;
}

class App extends React.Component<AppProps, AppState> {

    state: AppState = {} as AppState;
    appStore: AppStore;
    dataStore: DataStore;
    constructor(props: AppProps) {
        super(props);
        this.state = {
            collapsed: true,
            activeNavTab: undefined,
            isLoading: true,
        };
        this.appStore = new AppStore();
        this.dataStore = new DataStore();
    }

    componentDidMount() {
        if (!this.appStore.dataStore.initializing) 
            if (!this.appStore.dataStore.initialized)
                this.appStore.dataStore.initialize()
                .then((user: any) => {
                    if (!_.isNil(user))
                        this.setState({isLoading: false});
                })
                .catch((err) => {
                    console.error(err);
                });

    }

    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }

    render() {
        const content = (
            <div className="sb_app__container">
                {!this.state.isLoading && 
                <Layout>
                    <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    >
                        <div className="logo" />
                        <ComponentFactory.Navigation collapsed={this.state.collapsed} toggle={this.toggle} />
                    </Sider>
                    <Layout>
                        <Content>
                            <Switch>
                                <Route exact path="/" component={ComponentFactory.Home}/>
                                <Route path="/signin" component={ComponentFactory.SignIn}/>
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>}
            </div>
        );
        return (
            <Provider>
                <>
                <Observer>
                    {() => 
                    <Router>
                        <Route path="/"
                            render={(props: any) => {
                                AppStore.history = props.history;
                                AppStore.location = props.location;

                                return content;
                            }}/>
                    </Router>}
                </Observer>
                </>
            </Provider>
        );
    }
}

export default App;