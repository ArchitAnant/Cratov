const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes, parseEther } = require("ethers");

describe("Bidding Contract", function () {
  let Bidding, bidding, owner, agency, bidder1, bidder2,bidder3;

  beforeEach(async () => {
    [owner, agency, bidder1, bidder2,bidder3] = await ethers.getSigners();

    Bidding = await ethers.getContractFactory("Bidding");
    bidding = await Bidding.deploy();
    // await bidding.deployed();
  });

  it("Should add a post to activePosts", async () => {
    await expect(bidding.addItem("post1"))
      .to.emit(bidding, "PostAdded")
      .withArgs("post1");

    const postExists = await bidding.postExists(
      keccak256(toUtf8Bytes("post1"))
    );
    expect(postExists).to.equal(true);
  });

  it("Should allow adding a post to active biddings with ETH", async () => {
    await bidding.addItem("post1");

    const amount = parseEther("1.0");

    await expect(
      bidding.connect(bidder1).addPost(
        "post1",
        amount,
        agency.address,
        "bidder1_id",
        bidder1.address,
        { value: amount }
      )
    )
      .to.emit(bidding, "PostUpForBidding")
      .withArgs("post1");

    const postData = await bidding.getBidding("post1");
    expect(postData.amount).to.equal(amount);
    expect(postData.current_bidder_address).to.equal(bidder1.address);
  });

  it("Should allow downbidding, refund previous bidder, and send difference to agency", async () => {
    await bidding.addItem("post1");

    const initialBid = parseEther("1.0");

    // Bidder1 places initial bid
    await bidding.connect(bidder1).addPost(
        "post1",
        initialBid,
        agency.address,
        "bidder1_id",
        bidder1.address,
        { value: initialBid }
    );

    const newBid = parseEther("0.9");
    const expectedDownpayment = (newBid * 2n) / 100n; // 2%

    console.log("Initial Amount:", newBid.toString());
    console.log("Expected downpayment:", expectedDownpayment.toString());

    let balanceBeforeRefundBidder1 = await ethers.provider.getBalance(bidder1.address);
    let balanceBeforeRefundAgency = await ethers.provider.getBalance(agency.address);

    let differenceToAgency = initialBid - newBid;

    // This call should internally handle refund + agency payment
    await bidding.connect(bidder2).downbidPost(
        "post1",
        newBid,
        expectedDownpayment,
        "bidder2_id",
        bidder2.address,
        { value: expectedDownpayment }
    );

    // Take AFTER balances
    let balanceAfterRefundBidder1 = await ethers.provider.getBalance(bidder1.address);
    let balanceAfterRefundAgency = await ethers.provider.getBalance(agency.address);

    // Check bidder1 refund amount
    // const refundToBidder1 = balanceAfterRefundBidder1 - balanceBeforeRefundBidder1;
    // expect(refundToBidder1).to.equal(expectedDownpayment);

    // Check agency difference
    let agencyGain = balanceAfterRefundAgency - balanceBeforeRefundAgency;
    expect(agencyGain).to.equal(differenceToAgency);

    // Check updated post data
    let updatedPost = await bidding.getBidding("post1");
    expect(updatedPost.amount).to.equal(newBid);
    expect(updatedPost.current_bidder_address).to.equal(bidder2.address);




    const newNewBid = parseEther("0.8");
    const newExpectedDownpayment = (newNewBid * 2n) / 100n; // 2%

    balanceBeforeRefundAgency = await ethers.provider.getBalance(agency.address);
    const balanceBeforeRefundBidder2 = await ethers.provider.getBalance(bidder2.address);

    differenceToAgency = newBid - newNewBid;

    // This call should internally handle refund + agency payment
    await bidding.connect(bidder3).downbidPost(
        "post1",
        newNewBid,
        newExpectedDownpayment,
        "bidder3_id",
        bidder3.address,
        { value: newExpectedDownpayment }
    );

    // Take AFTER balances
    balanceAfterRefundAgency = await ethers.provider.getBalance(agency.address);
    const balanceAfterRefundBidder2 = await ethers.provider.getBalance(bidder2.address);

    // Check bidder1 refund amount
    const refundToBidder1 = balanceAfterRefundBidder2 - balanceBeforeRefundBidder2;
    expect(expectedDownpayment).to.equal(refundToBidder1);

    // // Check agency difference
    agencyGain = balanceAfterRefundAgency - balanceBeforeRefundAgency;

    

    expect(agencyGain).to.equal(differenceToAgency);

    // // Check updated post data
    updatedPost = await bidding.getBidding("post1");
    expect(updatedPost.amount).to.equal(newNewBid);
    expect(updatedPost.current_bidder_address).to.equal(bidder3.address);
});




  it("Should revert if downbid amount is not less", async () => {
    await bidding.addItem("post1");

    const initialBid = parseEther("1.0");

    await bidding.connect(bidder1).addPost(
      "post1",
      initialBid,
      agency.address,
      "bidder1_id",
      bidder1.address,
      { value: initialBid }
    );

    const expectedDownpayment = (initialBid * 2n) / 100n;

    await expect(
      bidding.connect(bidder2).downbidPost(
        "post1",
        parseEther("1.0"), // same amount, should fail
        expectedDownpayment,
        "bidder2_id",
        bidder2.address,
        { value: expectedDownpayment }
      )
    ).to.be.revertedWith("New amount must be less than current amount");
  });
});
