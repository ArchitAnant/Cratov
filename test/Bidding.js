const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes, parseEther } = require("ethers");

describe("Bidding Contract", function () {
  let Bidding, bidding, owner, agency, bidder1, bidder2;

  beforeEach(async () => {
    [owner, agency, bidder1, bidder2] = await ethers.getSigners();

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

  it("Should allow downbidding and refund previous bidder", async () => {
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

   const expectedDownpayment = (initialBid * 2n) / 100n; // 2%

    // Check initial balance of bidder1
    const balanceBeforeRefund = await ethers.provider.getBalance(bidder1.address);

    // Bidder2 downbids
    await bidding.connect(bidder2).downbidPost(
      "post1",
      parseEther("0.9"),
      expectedDownpayment,
      "bidder2_id",
      bidder2.address,
      { value: expectedDownpayment }
    );

    const balanceAfterRefund = await ethers.provider.getBalance(bidder1.address);

    // Refund happened
    expect(balanceAfterRefund - balanceBeforeRefund).to.equal(expectedDownpayment);
    // Check updated post data
    const updatedPost = await bidding.getBidding("post1");
    expect(updatedPost.amount).to.equal(parseEther("0.9"));
    expect(updatedPost.current_bidder_address).to.equal(bidder2.address);
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
