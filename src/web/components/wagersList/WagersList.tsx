import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Button, 
        Icon, 
        Drawer, 
        Form, 
        Input, 
        Select, 
        DatePicker } from "antd";
import {BaseComponent} from "../BaseComponent";
import * as ComponentFactory from "../ComponentFactory";
import {WagersListProps, WagersListState} from "./WagersListInterface";
import * as moment from "moment";
import TextArea from "antd/lib/input/TextArea";

const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 1;
let keys: any = [];

export class WagersList extends BaseComponent<WagersListProps, WagersListState> {
    constructor(props: WagersListProps) {
        super(props);
        this.state = {
            loading: true,
            wagers: undefined,
            wager_title: "",
            wager_description: "",
            share_type: "Public",
            wager_prize: "",
            wager_prize_type: "Monetary",
            wager_type: "Head to Head",
            wager_buy_in: "",
            closes_at: "",
            expires_at: "",
            options: {},
        };
        this.getWagers = this.getWagers.bind(this);
        this.handleAddWager = this.handleAddWager.bind(this);
        this.handleWagerPrizeChange = this.handleWagerPrizeChange.bind(this);
        this.handleBettingClosesChange = this.handleBettingClosesChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.submitCreateWager = this.submitCreateWager.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        this.getWagers()
        .then((wagers: any) => {
            this.setState({
                wagers: wagers,
                loading: false,
                visibleDrawer: false,
            });
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get Wagers");
        });
    }

    getWagers() {
        return new Promise((resolve, reject) => {
            this.appStore.dataStore.getAllWagers()
            .then((wagers: any) => {
                resolve(wagers);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    handleTextInputChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    onClose = () => {
        this.setState({
            visibleDrawer: false,
        });
    }

    handleAddWager(e: any) {
        this.setState({visibleDrawer: true});
    }

    handleWagerPrizeChange(value: any) {
        this.setState({
            wager_prize_type: value,
            wager_buy_in: "",
            wager_prize: ""
        });
    }

    handleBettingClosesChange(d: any, dataString: any) {
        this.setState({
            closes_at: moment(dataString).format()
        });
    }

    handleBetExpiresAt(d: any, dataString: any) {
        this.setState({
            expires_at: moment(dataString).format()
        });
    }

    submitCreateWager(e: any) {
        e.preventDefault();
        const newWagerData = {
            wager_title: this.state.wager_title,
            wager_description: this.state.wager_description,
            share_type: this.state.share_type,
            wager_prize: this.state.wager_prize,
            wager_prize_type: this.state.wager_prize_type,
            wager_type: this.state.wager_type,
            wager_buy_in: this.state.wager_buy_in,
            closes_at: this.state.closes_at,
            expires_at: this.state.expires_at,
            // options: this.state.options,
        };
        
    }

    addOption() {
        const option = `option${uuid}`;
        keys.push({
            option: option,
            value: ""
        });
        uuid++;
        this.setState({
            options: keys
        });
    }

    removeOption(k: any) {
        if (keys.length === 1) {
            return;
        }
        keys = keys.filter((item: any) => item.option !== k.option);
        this.setState({
            options: keys
        });
    }

    handleOptionChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        keys = keys.map((key: any) => {
            if (key.option === name) {
                key.value = value;
                return key;
            }
            return key;
        });
        this.setState({
            options: keys
        });
    }

    render() {
        const MonetaryPrize = this.state.wager_prize_type === "Monetary";
        let wagersList: any = [];
        if (_.isArray(this.state.wagers)) {
            wagersList = this.state.wagers.map((wager: any) => {
                return (
                    <ComponentFactory.WagerCard key={wager.wager_id} wager={wager} />
                );
            });
        }
        const formItems = keys.map((k: any) => {
            return (
                <FormItem
                key={k}>
                    <Input 
                        name={k.option}
                        value={k.value}
                        onChange={this.handleOptionChange}
                        placeholder="Wager Option" 
                        className="sb_wagers__option-input"/>
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button sb_wagers__option-remove-icon"
                            type="minus-circle-o"
                            onClick={() => this.removeOption(k)}
                        />
                    ) : null}
                </FormItem>
            );
          });

        const drawer = (
            <Drawer
                title="Create a Wager"
                placement={"right"}
                closable={false}
                onClose={this.onClose}
                visible={this.state.visibleDrawer}
                className="sb_wagers__add-wager-drawer"
            >
                <Form onSubmit={this.submitCreateWager}>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Title:</h5>
                        <Input 
                            type="text" 
                            value={this.state.wager_title} 
                            name="wager_title"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Description:</h5>
                        <TextArea 
                            value={this.state.wager_description} 
                            name="wager_description"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Type:</h5>
                        <Select defaultValue={this.state.wager_type} className="sb_wagers__add-wager-input">
                            <Option value="Head to Head">Head to Head</Option>
                            <Option value="Over / Under">Over / Under</Option>
                            <Option value="Futures / Outright">Futures / Outright</Option>
                            <Option value="Prop Bet / Specials">Prop Bet / Specials</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Share Type:</h5>
                        <Select defaultValue={this.state.share_type} disabled className="sb_wagers__add-wager-input">
                            <Option value="Public">Public</Option>
                            <Option value="Private">Private</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize Type:</h5>
                        <Select 
                            defaultValue={this.state.wager_prize_type} 
                            className="sb_wagers__add-wager-input"
                            onChange={this.handleWagerPrizeChange}>
                            <Option value="Monetary">Monetary</Option>
                            <Option value="Non-Monetary">Non-Monetary</Option>
                        </Select>
                    </FormItem>

                    {MonetaryPrize && 
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Buy In:</h5>
                        <Input 
                            prefix={"$"}
                            className="sb_wagers__add-wager-input"
                            type="number"
                            onChange={this.handleTextInputChange}
                            value={this.state.wager_buy_in}
                            name="wager_buy_in"/>
                    </FormItem>}

                    {!MonetaryPrize && 
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize:</h5>
                        <Input 
                            className="sb_wagers__add-wager-input"
                            type="text"
                            onChange={this.handleTextInputChange}
                            value={this.state.wager_prize}
                            name="wager_prize"/>
                    </FormItem>}
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Expires at:</h5>
                        <DatePicker 
                            className="sb_wagers__add-wager-input"
                            onChange={() => this.handleBetExpiresAt}
                            placeholder="Wager Expires at..." />
                    </FormItem>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Bets Close at:</h5>
                        <DatePicker 
                            className="sb_wagers__add-wager-input"
                            onChange={() => this.handleBettingClosesChange}
                            placeholder="Betting Closes at..." />
                    </FormItem>
                    <h5 className="sb_wagers__add-wager-input-label">Wager Options: </h5>
                    {formItems}

                    {keys.length < 3 &&
                    <FormItem className="sb_wagers__add-option-button">
                        <Button type="dashed" onClick={this.addOption} style={{ width: "60%" }}>
                            <Icon type="plus" /> Add Wager Option
                        </Button>
                    </FormItem>}

                    <FormItem className="sb_wagers__submit-button">
                        <Button 
                            onClick={this.handleAddWager}
                            type="primary" 
                            htmlType="submit" >
                            Create Wager
                        </Button>
                    </FormItem>

                </Form>
            </Drawer>
        );

        const content = (
            <div className="sb_app__component-container sb_wagers__component-container">
                <div className="sb_app__wagers-list-container">
                    {_.isArray(this.state.wagers) && 
                        wagersList}
                    {!_.isArray(this.state.wagers) &&
                    <h4>{this.state.wagers}</h4>}
                </div>
                <Button 
                    onClick={this.handleAddWager}
                    className="sb_wagers__add-wager-button">
                    <Icon 
                        className="sb_wagers__add-wager-icon"
                        type="plus" />
                </Button>
                {drawer}
            </div>
        );

        return(
            <Observer>
            {() => 
                <>
                {this.state.loading && 
                <ComponentFactory.Loading />}
                {!this.state.loading &&
                 content}
                </>}
            </Observer>
        );
    }
}