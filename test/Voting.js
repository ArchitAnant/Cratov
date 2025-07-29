const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();
  });

  it("should allow a user to vote and retrieve voters", async () => {
    await voting.voteOrAddPost("post1", "user1");
    const voters = await voting.getVoters("post1");
    expect(voters).to.include("user1");
  });

  it("should not allow the same user to vote twice", async () => {
    await voting.voteOrAddPost("post1", "user1");
    await expect(voting.voteOrAddPost("post1", "user1")).to.be.revertedWith("User has already voted");
  });

  it("should allow a user to unvote", async () => {
    await voting.voteOrAddPost("post1", "user1");
    await voting.unvoteUser("post1", "user1");
    const voters = await voting.getVoters("post1");
    expect(voters).to.not.include("user1");
  });

  it("should return an empty array for non-existent post", async () => {
    const voters = await voting.getVoters("no_such_post");
    expect(voters.length).to.equal(0);
  });

  it("should remove a post and all associated votes", async () => {
    await voting.voteOrAddPost("post1", "user1");
    await voting.voteOrAddPost("post1", "user2");
    await voting.removePost("post1");

    const voters = await voting.getVoters("post1");
    expect(voters.length).to.equal(0);

    await expect(voting.voteOrAddPost("post1", "user1")).to.not.be.reverted;
  });
});
