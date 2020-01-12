pragma solidity ^0.6.1;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable public winner;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        winner = players[index];
        players = new address payable[](0);
    }
    
    function getWinner() public view returns (address payable) {
        return winner;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory){
        return players;
    }
}
