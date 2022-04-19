//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Subscription {
  
  mapping(address => bool) subscribers;
  uint subscriptionPrice;
  uint rewardValue;
  
  constructor( uint _subscriptionPrice, uint _rewardValue) {
    subscriptionPrice = _subscriptionPrice;
    rewardValue = _rewardValue;
  }

  event SomeoneSubscribed(address subscriber);

  function subscribe() public payable {
    require(uint(msg.value) == subscriptionPrice, "Not correct price");
    require(subscribers[msg.sender] == false, "You can have only one subscription at a time");
    subscribers[msg.sender] = true;
    emit SomeoneSubscribed(msg.sender);
  }

  function subscribeToCurrentChain(address _subscriber) public {
    require(subscribers[_subscriber] == false, "You can have only one subscription at a time");
    subscribers[_subscriber] = true;
  }
}
