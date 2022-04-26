//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Subscription is Ownable {
  
  mapping(address => bool) public subscribers;
  mapping(address => bool) public agents;
  mapping(address => uint) public nextClaimDate;
  mapping(address => uint) public registrationDate;

  uint subscriptionPrice;
  uint rewardValue;
  
  constructor( uint _subscriptionPrice, uint _rewardValue) {
    subscriptionPrice = _subscriptionPrice;
    rewardValue = _rewardValue;
    agents[msg.sender] = true;
  }
  
  function getNextClaimDate(address subscriber) public view returns(uint){
    return nextClaimDate[subscriber];
  }

  function getRegistrationDate(address subscriber) public view returns(uint){
    return registrationDate[subscriber];
  }
  //agent functions
  function addAgent(address agent) public onlyOwner {
    agents[agent] = true;
  }

  function removeAgent(address agent) public onlyOwner {
    agents[agent] = false;
  }

  modifier onlyAgent() {
    require(agents[msg.sender], "Only agents can call this function" );
    _;
  }
  //end

  event SomeoneSubscribed(address subscriber);
  function subscribe() public payable {
    require(uint(msg.value) == subscriptionPrice, "Not correct price");
    require(subscribers[msg.sender] == false, "You can have only one subscription at a time");
    subscribers[msg.sender] = true;
    registrationDate[msg.sender] = block.timestamp;
    nextClaimDate[msg.sender] = block.timestamp + 10 seconds;
    emit SomeoneSubscribed(msg.sender);
  }

  function subscribeToCurrentChain(address subscriber) public onlyAgent{
    require(subscribers[subscriber] == false, "You can have only one subscription at a time");
    subscribers[subscriber] = true;
  }

  function claim(uint multiplier, address subscriber) public {
    require(subscribers[subscriber], "You must be subscribed to claim rewards");
    uint claimValue = rewardValue * multiplier;
    nextClaimDate[subscriber] += multiplier * 10 seconds;

    (bool success, ) = payable(subscriber).call{value: claimValue}("");
    require(success, "We are broke so we won't give you any money right now");
      
    if (nextClaimDate[subscriber] > registrationDate[subscriber] + 30 * 10 seconds)
      unsubscribe(subscriber);
  }

  function unsubscribe(address subscriber) public onlyAgent {
    subscribers[subscriber] = false;
  }
}
