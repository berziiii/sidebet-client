import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Icon, Button } from "antd";
import {BaseComponent} from "../BaseComponent";
import {WagerItemProps, WagerItemState} from "./WagerItemInterface";
import * as moment from "moment";
import * as ComponentFactory from "../ComponentFactory";

export class WagerItem extends BaseComponent<WagerItemProps, WagerItemState> {
    constructor(props: WagerItemProps) {
        super(props);
        this.state = {
            loading: true,
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
    }

    componentDidMount() {
        const {appStore} = this;
        const { match } = this.props.match;
        const wagerId = match.params.wagerId;

        this.getWagerDetails(wagerId)
        .then((wager: any) => {
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
                owner_id: wager.owner.owner_id,
                created_at: wager.created_at,
                last_modified: wager.last_modified,
                userBet: userBet
            });
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get Wager");
        });
    }

    getWagerDetails(wagerId: string) {
        const {appStore} = this;
        return appStore.dataStore.getWagerById(wagerId);
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
                let userBet = undefined;
                wager.bets.forEach((bet: any) => {
                    if (appStore.dataStore.authorizedUser.user_id === bet.user_id)
                        userBet = bet.option_id;
                });
                this.setState({
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
                    owner_id: wager.owner.owner_id,
                    created_at: wager.created_at,
                    last_modified: wager.last_modified,
                    userBet: userBet
                });
                appStore.showMessage("success", "Bet Successfully Made.");
            })
            .catch((err: any) => {
                console.error(err);
                appStore.showMessage("error", "Something went wrong. Unable to enter Bet");
            });
    }

    render() {
        const MonetaryPrize = this.state.wager_prize_type === "Monetary";

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