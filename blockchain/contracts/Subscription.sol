//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Subscription is Ownable {  
  mapping(address => bool) subscribers;
  mapping(address => bool) agents;
  mapping(address => uint) nextClaimDate;
  mapping(address => uint) registrationDate;

  uint public subscriptionPrice;
  uint public rewardValue;
  
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
    subscribeToCurrentChain(msg.sender);
    emit SomeoneSubscribed(msg.sender);
  }

  function subscribeToCurrentChain(address subscriber) public onlyAgent{
    require(subscribers[subscriber] == false, "You can have only one subscription at a time");
    subscribers[subscriber] = true;
    registrationDate[subscriber] = block.timestamp;
    nextClaimDate[subscriber] = block.timestamp + 10 seconds;
  }

  function claim(address subscriber, uint claimValue, uint nextClaimDateValue) public {
    require(subscribers[subscriber], "You must be subscribed to claim rewards");
    
    (bool success, ) = subscriber.call{value: claimValue * rewardValue }("");
    require(success, "We are broke so we won't give you any money right now");
      
    nextClaimDate[subscriber] = nextClaimDateValue;
    if (nextClaimDate[subscriber] > registrationDate[subscriber] + 300 seconds)
      subscribers[subscriber] = false;
  }
}
