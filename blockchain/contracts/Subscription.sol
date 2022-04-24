//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Subscription is Ownable {
  
  mapping(address => bool) subscribers;
  mapping(address => bool) agents;

  uint subscriptionPrice;
  uint rewardValue;
  
  constructor( uint _subscriptionPrice, uint _rewardValue) {
    subscriptionPrice = _subscriptionPrice;
    rewardValue = _rewardValue;
    agents[msg.sender] = true;
  }

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

  event SomeoneSubscribed(address subscriber);

  function subscribe() public payable {
    require(uint(msg.value) == subscriptionPrice, "Not correct price");
    require(subscribers[msg.sender] == false, "You can have only one subscription at a time");
    subscribers[msg.sender] = true;
    emit SomeoneSubscribed(msg.sender);
  }

  function subscribeToCurrentChain(address _subscriber) public onlyAgent{
    require(subscribers[_subscriber] == false, "You can have only one subscription at a time");
    subscribers[_subscriber] = true;
  }
}
