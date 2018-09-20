export interface WagerItemProps {
    props?: any;
    match?: any;
}

export interface WagerItemState {
    loading?: boolean;
    modalVisible?: boolean;
    dirtyData?: boolean;
    wager_id?: string | undefined;
    wager_title?: string | undefined;
    wager_description?: string | undefined;
    special_instruction?: string | undefined;
    share_type?: string | undefined;
    wager_prize?: string | undefined;
    wager_prize_type?: string | undefined;
    wager_type?: string | undefined;
    wager_buy_in?: string | undefined;
    wager_status?: string | undefined;
    closes_at?: any;
    expires_at?: any;
    options?: any | undefined;
    bets?: any | undefined;
    owner?: any | undefined;
    created_at?: any | undefined;
    last_modified?: any | undefined;
    owner_id?: any | undefined;
    userBet?: any | undefined;
    visibleDrawer?: any | undefined;
    visibleWinnerModal?: any | undefined;
    winning_option?: any | undefined;
    proposedWinner?: any | undefined;
}