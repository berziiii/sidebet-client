import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Icon, Button, Drawer, Form, Input, DatePicker, Select } from "antd";
import {BaseComponent} from "../BaseComponent";
import {WagerItemProps, WagerItemState} from "./WagerItemInterface";
import * as moment from "moment";
import * as ComponentFactory from "../ComponentFactory";
import TextArea from "antd/lib/input/TextArea";

const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 1;
let keys: any = [];

export class WagerItem extends BaseComponent<WagerItemProps, WagerItemState> {
    constructor(props: WagerItemProps) {
        super(props);
        this.state = {
            loading: true,
            visibleDrawer: false,
            wager_id: undefined,
            wager_title: undefined,
            bets: [],
            wager_description: undefined,
            share_type: undefined,
            wager_prize: undefined,
            wager_prize_type: undefined,
            wager_type: undefined,
            wager_buy_in: undefined,
            closes_at: undefined,
            expires_at: undefined,
            options: [],
            owner: undefined,
            userBet: undefined,
        };

        this.getWagerDetails = this.getWagerDetails.bind(this);
        this.handleBet = this.handleBet.bind(this);
        this.setWagerState = this.setWagerState.bind(this);
        this.removeBet = this.removeBet.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleEditWager = this.handleEditWager.bind(this);
        this.handleWagerPrizeChange = this.handleWagerPrizeChange.bind(this);
        this.handleBettingClosesChange = this.handleBettingClosesChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.submitEditWager = this.submitEditWager.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        // this.editWager = this.editWager.bind(this);
        // this.editWagerOption = this.editWagerOption.bind(this);
    }

    componentDidMount() {
        uuid = 1;
        keys = [];
        const { match } = this.props.match;
        const wagerId = match.params.wagerId;

        this.getWagerDetails(wagerId)
        .then((wager: any) => {
            this.setWagerState(wager);
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get Wager");
        });
    }

    setWagerState(wager: any) {
        const {appStore} = this;
        let userBet = undefined;
        wager.bets.forEach((bet: any) => {
            if (appStore.dataStore.authorizedUser.user_id === bet.user_id)
                userBet = bet.option_id;
        });
        this.setState({
            loading: false,
            wager_id: wager.wager_id,
            wager_title: wager.wager_title,
            bets: wager.bets,
            wager_description: wager.wager_description,
            share_type: wager.share_type,
            wager_prize: wager.wager_prize,
            wager_prize_type: wager.wager_prize_type,
            wager_type: wager.wager_type,
            wager_buy_in: wager.wager_buy_in,
            closes_at: wager.closes_at,
            expires_at: wager.expires_at,
            options: wager.options,
            owner: wager.owner.username,
            owner_id: wager.owner.user_id,
            created_at: wager.created_at,
            last_modified: wager.last_modified,
            userBet: userBet
        });
    }

    getWagerDetails(wagerId: any) {
        const {appStore} = this;
        return appStore.dataStore.getWagerById(wagerId);
    }

    removeBet() {
        const { appStore, state } = this;
        const betData = {
            wager_id: state.wager_id,
        };
        appStore.dataStore.deleteUserBet(betData)
        .then(() => {
            return this.getWagerDetails(betData.wager_id);
        })
        .then((wager: any) => {
            this.setWagerState(wager);
            appStore.showMessage("success", "Successfully removed Bet");
        })
        .catch((err: any) => {
            console.error(err);
            appStore.showMessage("error", "Something went wrong. Unable to remove Bet");
        });
    }

    handleBet(option: any) {
        const { appStore, state } = this;
        const optionData = {
            wager_id: state.wager_id,
            option_id: option.option_id,
            owner_id: appStore.dataStore.authorizedUser.user_id,
            bet_amount: state.wager_buy_in
        };
        if (optionData.option_id !== state.userBet)
            appStore.dataStore.enterUserBet(optionData)
            .then((betDetails: any) => {
                return this.getWagerDetails(betDetails.wager_id);
            })
            .then((wager: any) => {
                this.setWagerState(wager);
                appStore.showMessage("success", "Bet Successfully Made.");
            })
            .catch((err: any) => {
                console.error(err);
                appStore.showMessage("error", "Something went wrong. Unable to enter Bet");
            });
        if (optionData.option_id === state.userBet)
            this.removeBet();
    }

    handleTextInputChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    onClose() {
        this.setState({
            visibleDrawer: false,
        });
    }

    handleEditWager(e: any) {
        this.setState({visibleDrawer: true});
    }

    handleWagerPrizeChange(value: any) {
        this.setState({
            wager_prize_type: value,
            wager_buy_in: "",
            wager_prize: ""
        });
    }

    handleBettingClosesChange(d: any, dateStamp: any) {
        const timestame = moment(dateStamp).format();
        this.setState({
            closes_at: timestame
        });
    }

    handleBetExpiresAt(d: any, dateStamp: any) {
        const timestame = moment(dateStamp).format();
        this.setState({
            expires_at: timestame
        });
    }

    submitEditWager(e: any) {
        // e.preventDefault();
        // const newWagerData = {
        //     wager_title: this.state.wager_title,
        //     wager_description: this.state.wager_description,
        //     share_type: this.state.share_type,
        //     wager_prize_type: this.state.wager_prize_type,
        //     wager_type: this.state.wager_type,
        //     closes_at: this.state.closes_at,
        //     expires_at: this.state.expires_at,
        // };
        // if (this.state.wager_prize_type === "Monetary")
        //     newWagerData["wager_buy_in"] = this.state.wager_buy_in;
        // else 
        //     newWagerData["wager_prize"] = this.state.wager_prize;
        // if (this.appStore.validateNewWager(newWagerData)) {
        //     this.createWager(newWagerData);
        // } else {
        //     this.appStore.showMessage("error", "Please Complete All Form fields.");
        //     if (keys.length < 2) 
        //         this.appStore.showMessage("error", "Must have at Minimum 2 Wager Options");
        // }

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
        const userIsOwner = this.state.owner_id === this.appStore.dataStore.authorizedUser.user_id;
        const ownerInitial = () => {
            if (!_.isNil(this.state.owner))
                return this.state.owner.charAt(0).toUpperCase();
            return "U";
        };

        const ownerAvatar = (
            <div className="sb_wager__owner-avatar">{ownerInitial()}</div>
        );

        const wagerStatus = (
            <>
                {!_.isNil(this.state.expires_at) && 
                    <>
                        {moment().format() < this.state.expires_at && 
                        <div className="sb_wager__status">
                            <div className="open-status"/>
                            <h5 className="open">Open</h5>
                        </div>}
                        {moment().format() >= this.state.expires_at && 
                        <div className="sb_wager__status">
                            <div className="closed-status"/>
                            <h5 className="closed">Closed</h5>
                        </div>}
                    </>
                }
            </>
        );

        const optionBets = (option: any) => this.state.bets.map((bet: any) => {
            return (
                <>
                    {bet.option_id === option.option_id && 
                    <div className="sb_wager__bets-wrapper">
                        <div className="sb_wager__bet-user-avatar">{bet.username.charAt(0).toUpperCase()}</div> {bet.username}
                    </div>}
                </>
            );
        });

        const wagerOptions = this.state.options.map((option: any) => {
            const {state} = this;
            const optionWidth = 100 / this.state.options.length;
            let hasBets = false;
            state.bets.forEach((bet: any) => {
                if (bet.option_id === option.option_id)
                    hasBets = true;
            });
            const userBetOption = state.userBet === option.option_id;
            return (
                <>
                    <div className="sb_wager__option-wrapper" style={{width: `${optionWidth}%`}}>
                        {userBetOption && 
                        <Button 
                            className="sb_wager__option-button sb_wager__user-selected-option"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {!userBetOption && 
                        <Button 
                            className="sb_wager__option-button"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {hasBets && optionBets(option)}
                        {!hasBets &&
                            <h4 className="sb_wager__no-bets"> No Bets</h4>}
                    </div>
                </>
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
                <Form onSubmit={this.submitEditWager}>
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
                            onChange={this.handleWagerPrizeChange}
                            >
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
                        <h5 className="sb_wagers__add-wager-input-label">Bets Close at:</h5>
                        <DatePicker 
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            defaultValue={moment(this.state.closes_at, "YYYY-MM-DD HH:mm:ss")}
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBettingClosesChange(d, ds)}
                            placeholder="Betting Closes at..." />
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Expires at:</h5>
                        <DatePicker 
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            defaultValue={moment(this.state.expires_at, "YYYY-MM-DD HH:mm:ss")}
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBetExpiresAt(d, ds)}
                            placeholder="Wager Expires at..." />
                    </FormItem>

                    <h5 className="sb_wagers__add-wager-input-label">Wager Options (2-3 Options): </h5>
                    {/* {formItems} */}

                    {keys.length < 3 &&
                    <FormItem 
                        className="sb_wagers__add-option-button">
                        <Button type="dashed" onClick={this.addOption} style={{ width: "60%" }}>
                            <Icon type="plus" /> Add Wager Option
                        </Button>
                    </FormItem>}

                    <FormItem className="sb_wagers__submit-button">
                        <Button 
                            onClick={this.handleEditWager}
                            type="primary" 
                            htmlType="submit" >
                            Create Wager
                        </Button>
                    </FormItem>

                </Form>
            </Drawer>
        );

        const content = (
            <div className="sb_wager__main-container">
                <div className="sb_wager__card-container">
                    <h2 className="sb_wager__wager-title">{this.state.wager_title}</h2>
                    <div className="sb_wager__wager-content-container">
                        <div className="sb_wager__wager-meta-data-container">
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Owner</span> <div className="sb_wager__wager-meta-data-content">{ownerAvatar}{this.state.owner}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Status</span> <div className="sb_wager__wager-meta-data-content">{wagerStatus}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Betting Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(this.state.closes_at).format("llll")}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Wager Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(this.state.expires_at).format("llll")}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5>
                                    <span>Wager Type</span>
                                    <div className="sb_wager__wager-meta-data-content">
                                        <Icon type="star" /> {this.state.wager_type}
                                    </div>
                                </h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Prize Type</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            <Icon type="gift" /> {this.state.wager_prize_type}
                                        </div>
                                    </h5>
                                </div>
                            {MonetaryPrize && 
                            <>
                                <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Buy In Amount</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            ${this.state.wager_buy_in}
                                        </div>
                                    </h5>   
                                </div>
                            </>}
                            {!MonetaryPrize && 
                            <>
                                <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Prize</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            <Icon type="trophy" /> {this.state.wager_prize}
                                        </div>
                                    </h5>
                                </div>
                            </>}
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Last Modified</span> <div className="sb_wager__wager-meta-data-content">{moment(this.state.last_modified).format("llll")}</div></h5>
                            </div>
                        </div>
                        <div className="sb_wager__wager-details">
                            <p className="sb_wager__wager-description">{this.state.wager_description}</p> 
                            <h2> Place a Bet! </h2>  
                            <div className="sb_wager__wager-options-container">
                                {wagerOptions}
                            </div> 
                        </div>
                    </div>
                </div>

                {userIsOwner && 
                <Button 
                    onClick={this.handleEditWager}
                    className="sb_wager__edit-wager-button">
                    <Icon 
                        className="sb_wager__edit-wager-icon"
                        type="edit" />
                </Button>}

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