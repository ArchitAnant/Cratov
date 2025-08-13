// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Bidding {
    // Active post list
    string[] public activePosts;

    // Post existence mapping for O(1) lookup
    mapping(bytes32 => bool) public postExists;

    // Active biddings
    struct Post {
        uint amount;
        address payable agency_address;
        string current_bidder_id;
        address current_bidder_address;
        uint end_date;
    }
    mapping(bytes32 => Post) private activeBiddings;

    // Events
    event PostAdded(string postId);
    event PostRemoved(string postId);
    event PostUpForBidding(string postId);

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

        // Remove bidding if present
        delete activeBiddings[k];

        emit PostRemoved(item);
    }

    // Add a post to active biddings
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

        // Require the caller to send exact amount in ETH
        require(msg.value == amount, "Incorrect ETH amount sent");

        // Store the bidding
        activeBiddings[k] = Post({
            amount: amount,
            agency_address: agency_address,
            current_bidder_id: current_bidder_id,
            current_bidder_address: current_bidder_address,
            end_date: block.timestamp + 7 days
        });

        emit PostUpForBidding(post_id);
    }

    function downbidPost(
        string calldata post_id,
        uint amount,
        uint downpaymentAmount,
        string calldata bidder_id,
        address bidder_address
    ) external payable {
        bytes32 k = _key(post_id);

        // Ensure post exists
        require(activeBiddings[k].amount != 0, "No active bidding");
        Post storage p = activeBiddings[k];

        // Ensure bidding is still active
        require(block.timestamp < p.end_date, "Bidding has ended");

        // Ensure new bid is lower
        require(amount < p.amount, "New amount must be less than current amount");

        // Ensure correct downpayment sent
        require(msg.value == downpaymentAmount, "Incorrect downpayment sent");

        // 2% rule check
        uint expectedDownpayment = (p.amount * 2) / 100;
        require(downpaymentAmount == expectedDownpayment, "Downpayment must be 2% of current amount");

        // Refund 2% to the current bidder
        (bool sent, ) = p.current_bidder_address.call{value: expectedDownpayment}("");
        require(sent, "Refund to current bidder failed");

        // Update bidding info
        p.amount = amount;
        p.current_bidder_id = bidder_id;
        p.current_bidder_address = bidder_address;
    }


    // View details of a bidding post
    function getBidding(string calldata post_id) external view returns (Post memory) {
        bytes32 k = _key(post_id);
        require(activeBiddings[k].amount != 0, "No active bidding");
        return activeBiddings[k];
    }
}
