// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Bidding {
    // Active post list
    string[] public activePosts;

    // Post existence mapping for O(1) lookup
    mapping(bytes32 => bool) public postExists;

    // Active biddings
    struct Post {
        uint amount; // current winning amount
        address payable agency_address; // who funded initial amount
        string current_bidder_id;
        address payable current_bidder_address;
        uint end_date;
    }
    mapping(bytes32 => Post) private activeBiddings;

    // Withdrawable balances (withdraw pattern)
    mapping(address => uint) public pendingWithdrawals;

    // Reentrancy guard
    bool private locked;

    // Events
    event PostAdded(string postId);
    event PostRemoved(string postId);
    event PostUpForBidding(string postId);
    event BidDown(string postId, string bidderId, address bidderAddress, uint newAmount);
    event AuctionFinalized(string postId, address winner, uint amount);
    event Withdrawal(address indexed who, uint amount);

    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // Internal key helper
    function _key(string memory key) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(key));
    }

    // Add post to active list
    function addItem(string calldata item) external {
        bytes32 k = _key(item);
        require(!postExists[k], "Post already active");

        activePosts.push(item);
        postExists[k] = true;

        emit PostAdded(item);
    }

    // Remove post from active list and delete from biddings if exists
    function removeItem(string calldata item) external {
        bytes32 k = _key(item);
        require(postExists[k], "Post not active");

        // Swap-and-pop removal
        for (uint i = 0; i < activePosts.length; i++) {
            if (_key(activePosts[i]) == k) {
                activePosts[i] = activePosts[activePosts.length - 1];
                activePosts.pop();
                break;
            }
        }

        // Clear existence
        postExists[k] = false;

        // Remove bidding if present (refunds handled via pendingWithdrawals on finalize or earlier)
        delete activeBiddings[k];

        emit PostRemoved(item);
    }

    /// @notice Agency creates an auction by depositing the full amount into escrow.
    function addPost(
        string calldata post_id,
        uint amount,
        address payable agency_address,
        string calldata current_bidder_id,
        address current_bidder_address
    ) external payable {
        bytes32 k = _key(post_id);

        require(postExists[k], "Post is not present");
        require(activeBiddings[k].amount == 0, "Bidding already active");

        // Require the caller to send exact amount in ETH (escrow)
        require(msg.value == amount, "Incorrect ETH amount sent");

        // Store the bidding. The contract now holds the escrow (msg.value).
        activeBiddings[k] = Post({
            amount: amount,
            agency_address: agency_address,
            current_bidder_id: current_bidder_id,
            current_bidder_address: payable(current_bidder_address),
            end_date: block.timestamp + 7 days
        });

        emit PostUpForBidding(post_id);
    }

    /**
     * @notice Downbid the post: bidder offers a lower amount.
     * @param post_id the id of the post
     * @param newAmount the proposed lower amount
     * @param downpaymentAmount the downpayment (2% of newAmount) to be provided now
     * @param bidder_id bidder identifier (string)
     * @param bidder_address bidder wallet address
     *
     * Security: uses withdraw pattern. All outgoing transfers are credited to pendingWithdrawals.
     */
    function downbidPost(
        string calldata post_id,
        uint newAmount,
        uint downpaymentAmount,
        string calldata bidder_id,
        address bidder_address
    ) external payable nonReentrant {
        bytes32 k = _key(post_id);

        // Ensure post bidding exists
        require(activeBiddings[k].amount != 0, "No active bidding");
        Post storage p = activeBiddings[k];

        // Ensure bidding is still active
        require(block.timestamp < p.end_date, "Bidding has ended");

        // Ensure new bid is lower
        require(newAmount < p.amount, "New amount must be less than current amount");

        // Downpayment must be exactly 2% of newAmount (proposed amount)
        uint expectedDownpayment = (newAmount * 2) / 100;
        require(downpaymentAmount == expectedDownpayment, "DownpaymentAmount param incorrect.");
        require(msg.value == expectedDownpayment, "Incorrect downpayment sent");

        // Store old bidder info and amount
        address payable oldBidder = p.current_bidder_address;
        uint oldAmount = p.amount;

        // Compute refunds/credits
        uint refundToOldBidder = 0;
        if (oldBidder != p.agency_address && oldBidder != address(0)) {
            // previous bidder gets 2% of their (old) amount back
            refundToOldBidder = (oldAmount * 2) / 100;
            pendingWithdrawals[oldBidder] += refundToOldBidder;
        }

        // Agency should get the difference between oldAmount and newAmount
        uint diffToAgency = 0;
        if (oldAmount > newAmount) {
            diffToAgency = oldAmount - newAmount;
            pendingWithdrawals[p.agency_address] += diffToAgency;
        }

        // Effects: update stored bidding info (amount and bidder)
        p.amount = newAmount;
        p.current_bidder_id = bidder_id;
        p.current_bidder_address = payable(bidder_address);

        // The msg.value (new downpayment) remains in contract as part of escrow.
        // Note: we don't transfer funds here; users/agencies call withdraw() to get pending funds.

        emit BidDown(post_id, bidder_id, bidder_address, newAmount);
    }

    /// @notice Finalize the auction after end_date: pay the winner (credit withdraw) and cleanup.
    function finalizeAuction(string calldata post_id) external nonReentrant {
        bytes32 k = _key(post_id);
        require(activeBiddings[k].amount != 0, "No active bidding");
        Post storage p = activeBiddings[k];

        require(block.timestamp >= p.end_date, "Auction not ended yet");

        // If there's a valid bidder, credit them the winning amount.
        if (p.current_bidder_address != address(0)) {
            uint payout = p.amount;
            // Credit payout to winner's pending withdrawals
            pendingWithdrawals[p.current_bidder_address] += payout;
        } else {
            // No bidder: return funds to agency
            pendingWithdrawals[p.agency_address] += p.amount;
        }

        // Cleanup auction
        delete activeBiddings[k];
        // Optionally, keep postExists[k] as-is or set false if you want to remove it from active posts
        postExists[k] = false;

        emit AuctionFinalized(post_id, p.current_bidder_address, p.amount);
    }

    /// @notice Withdraw accumulated refunds/payouts.
    function withdraw() external nonReentrant {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        pendingWithdrawals[msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Withdraw transfer failed");

        emit Withdrawal(msg.sender, amount);
    }

    // View details of a bidding post
    function getBidding(string calldata post_id) external view returns (Post memory) {
        bytes32 k = _key(post_id);
        require(activeBiddings[k].amount != 0, "No active bidding");
        return activeBiddings[k];
    }

    // Allow contract to receive ETH (if needed)
    receive() external payable {}
}
