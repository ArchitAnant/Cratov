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
        uint newAmount,
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
        require(newAmount < p.amount, "New amount must be less than current amount");

        // Downpayment must be exactly 2% of newAmount (proposed amount)
        uint expectedDownpayment = (newAmount * 2) / 100;

        require(
            downpaymentAmount == expectedDownpayment,
            "DownpaymentAmount param incorrect ."
        );
        require(msg.value == expectedDownpayment, "Incorrect downpayment sent");

        // Store old bidder info and amount before overwriting
        address oldBidder = p.current_bidder_address;
        uint oldAmount = p.amount;

        // --- EFFECTS ---
        p.amount = newAmount;
        p.current_bidder_id = bidder_id;
        p.current_bidder_address = bidder_address;

        // --- INTERACTIONS ---
        // Refund 2% of old amount to previous bidder if they are not the agency
        if (oldBidder != p.agency_address) {
            uint refundToOldBidder = (oldAmount * 2) / 100;
            (bool sentOld, ) = oldBidder.call{value: refundToOldBidder}("");
            require(sentOld, "Refund to previous bidder failed");
        }

        // Refund the difference between old and new amount to agency
        uint diffToAgency = oldAmount - newAmount;
        (bool sentAgency, ) = p.agency_address.call{value: diffToAgency}("");
        require(sentAgency, "Refund to agency failed");
    }


    


    // View details of a bidding post
    function getBidding(string calldata post_id) external view returns (Post memory) {
        bytes32 k = _key(post_id);
        require(activeBiddings[k].amount != 0, "No active bidding");
        return activeBiddings[k];
    }
}
