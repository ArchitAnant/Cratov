// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// maintain a map of post_id = list[voters]
// expose the functions for adding upvote, removing upvote, adding a new post, removing a post

contract Voting {
    mapping(bytes32 => string[]) private data;
    mapping (bytes32 => bool) private exists;
    mapping(bytes32 => mapping(bytes32 => bool)) private voted;

    event PostUpvoted(string postid, string userid);
    event PostDownvoted(string postid, string userid);
    event RemovePost(string postid);

    function _key(string memory key) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(key));
    }
    
    function voteOrAddPost(string calldata postid, string calldata userid) external {
        bytes32 hashed = _key(postid);
        bytes32 userHash = _key(userid);

        require(!voted[hashed][userHash], "User has already voted");

        data[hashed].push(userid);
        voted[hashed][userHash] = true;
        exists[hashed] = true;
        emit PostUpvoted(postid, userid);
    }

    function getVoters(string calldata key) external view returns (string[] memory) {
        bytes32 hashed = _key(key);
        if (exists[hashed]){
            return data[hashed];
        }
        else {
            return new string[](0);
        }    
    }

    function unvoteUser(string calldata key,string calldata userid) external returns(uint) {
        bytes32 hashed = _key(key);
        require(exists[hashed],"Post does not exist");
        string[] storage currUsers = data[hashed];
        for (uint i=0; i<currUsers.length; i++){
            if (_key(currUsers[i]) == _key(userid)){
                data[hashed][i] = currUsers[currUsers.length-1];
                data[hashed].pop();
                break;
            }
        }
        voted[hashed][_key(userid)] = false;
        emit PostDownvoted(key, userid);
        return data[hashed].length;
    }

    function removePost(string calldata postid) external {
        bytes32 hashed = _key(postid);
        require(exists[hashed], "Post does not exist");
        for (uint i = 0; i < data[hashed].length; i++) {
            delete voted[hashed][_key(data[hashed][i])];
        }
        delete data[hashed];
        delete exists[hashed];
        emit RemovePost(postid);
    }

}