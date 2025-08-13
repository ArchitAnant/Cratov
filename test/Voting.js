const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting;

  beforeEach(async () => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(); // No need for .deployed()
  });

  it("A user to upvote post", async () => {
    await expect(voting.voteOrAddPost("post1", "user1"))
      .to.emit(voting, "PostUpvoted")
      .withArgs("post1", "user1");

    const voters = await voting.getVoters("post1");
    expect(voters).to.deep.equal(["user1"]);
  });

  it("should not allow the same user to upvote twice", async () => {
    await voting.voteOrAddPost("post1", "user1");
    await expect(voting.voteOrAddPost("post1", "user1"))
      .to.be.revertedWith("User has already voted");
  });

  it("should allow another user to upvote same post", async () => {
    await voting.voteOrAddPost("post1", "user2");
    await voting.voteOrAddPost("post1", "user3");

    const voters = await voting.getVoters("post1");
    const voterList = voters.map(v => v.toString());
    expect(voterList).to.have.members(["user2", "user3"]);
  });

  it("should allow a user to unvote", async () => {
    await voting.voteOrAddPost("post1", "user1");
    await voting.voteOrAddPost("post1", "user2");

    await expect(voting.unvoteUser("post1", "user1"))
      .to.emit(voting, "PostDownvoted")
      .withArgs("post1", "user1");

    const voters = await voting.getVoters("post1");
    expect(voters).to.deep.equal(["user2"]);
  });

  it("should allow removing a post", async () => {
    await voting.voteOrAddPost("post1", "user1");

    await expect(voting.removePost("post1"))
      .to.emit(voting, "RemovePost")
      .withArgs("post1");

    const voters = await voting.getVoters("post1");
    expect(voters).to.deep.equal([]);
  });
});