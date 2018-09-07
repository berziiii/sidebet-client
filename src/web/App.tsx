import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as _ from "lodash";
import * as React from "react";
import {Observer, Provider, observer} from "mobx-react";
import * as ComponentFactory from "./components/ComponentFactory";
import {DataStore} from "../core/stores/DataStore";
import {AppStore, AppMode} from "./stores/AppStore";
import { Layout } from "antd";

const { Content, Sider, Footer } = Layout;

export interface AppProps {
    config?: any;
    locale?: string;
    showHeader?: boolean;
}

export interface AppState {
    isLoading?: any;
    mode?: any;
}

@observer
class App extends React.Component<AppProps, AppState> {

    state: AppState = {} as AppState;
    appStore: AppStore;
    dataStore: DataStore;
    constructor(props: AppProps) {
        super(props);
        this.state = {
            isLoading: true,
            mode: AppMode.Desktop
        };
        this.appStore = new AppStore();
        this.dataStore = new DataStore();
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        this.appStore.dataStore.initialize()
        .then((user: any) => {
            this.setState({isLoading: false});
            if (_.isNil(this.appStore.dataStore.authorizedUser))
                this.appStore.dataStore.clearUserAndToken();
        })
        .catch((err) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        const mode = this.appStore.evaluateMode();
        if (this.state.mode !== mode)
            this.setState({mode: mode});
    }

    render() {
        const header = (
            <>
                {this.state.mode === AppMode.Desktop &&
                <Sider
                style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0 }}
                >
                    <div className="logo" />
                    <ComponentFactory.Navigation />
                </Sider> }
                {this.state.mode === AppMode.Mobile && 
                    <ComponentFactory.Navigation />
                }
            </>
        );

        const content = (
            <>
                <Content>
                    <Switch>
                        {/* User Routes */}
                        <Route exact path={"/"} component={ComponentFactory.Wagers}/>
                        <Route exact path={"/signin"} component={ComponentFactory.SignIn}/>
                        <Route exact path={"/signup"} component={ComponentFactory.SignUp}/>
                        <Route exact path={"/profile"} component={ComponentFactory.Profile}/>

                        {/* Admin Routes */}
                        <Route exact path={"/admin/users"} component={ComponentFactory.AdminUsers}/>
                        <Route exact path={"/admin/users/:userId"} component={ComponentFactory.AdminUser} match={this.props}/>
                        <Route exact path={"/admin/wagers"} component={ComponentFactory.AdminWagers}/>

                        <Route component={ComponentFactory.NotFound}/>
                    </Switch>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    SideBet &copy;2018
                </Footer>
            </>
        );

        const layout = (
            <div className="sb_app__container">
                <Layout>
                    {this.state.isLoading &&
                    <ComponentFactory.Loading />}

                    {!this.state.isLoading && 
                        <>
                        {this.state.mode === AppMode.Desktop && 
                            <>
                                {header}
                                <Layout style={{ marginLeft: 150 }}>
                                    {content}
                                </Layout>
                            </>
                        }
                        {this.state.mode === AppMode.Mobile && 
                            <>
                            {header}
                            <Layout>
                                {content}
                            </Layout>
                            </>
                        }
                        </>
                    }
                </Layout>
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

                                return layout;
                            }}/>
                    </Router>}
                </Observer>
                </>
            </Provider>
        );
    }
}

export default App;