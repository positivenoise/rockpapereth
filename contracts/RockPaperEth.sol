pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/* 
@title RockPaperEth
@author Brendan Muscat <brendan.muscat@gmail.com>
@description Rock Paper Scissors on the ethereum blockchain!  
@address http://rock-paper-scissors.com
*/

contract RockPaperEth is Ownable, Pausable {

    mapping (string => mapping(string => int)) results;
    address public player1;
    address public player2;
    string public player1Hand;
    string public player2Hand;
    bytes32 player1HandHash;
    bytes32 player2HandHash;
    uint countdownBegins;

    event PlayerPhase(
        address _player,
        uint _phase
    );

    modifier notRegistered() { 
        /** makes sure a player is NOT already registered */
        require (msg.sender != player1 && msg.sender != player2);
        _;
    }
    modifier notNotRegistered() { 
        /** makes sure a player is already registered */
        require (msg.sender == player1 || msg.sender == player2);
        _;
    }
    
    modifier notPoor(uint amount) {
        /** ensures the player is not a peasant and has set the right amount. Currently set to 0.1 ether because games aren't for poor people */
        require (msg.value == amount);
        _;
    }

    modifier notStupid(string hand) {
        /** string validation for encrypt */
        require (compareStrings(hand,"rock") || compareStrings(hand,"paper") || compareStrings(hand,"scissors"));
        _;
    }
    
    constructor() public payable 
    {   
        /** constructor holding results matrix for determining winners */
        results["paper"]["rock"] = 1;
        results["paper"]["paper"] = 0;
        results["paper"]["scissors"] = 2;
        results["rock"]["rock"] = 0;
        results["rock"]["paper"] = 2;
        results["rock"]["scissors"] = 1;
        results["scissors"]["rock"] = 2;
        results["scissors"]["paper"] = 1;
        results["scissors"]["scissors"] = 0;
    }


    function register() public payable notRegistered notPoor(0.1 ether) whenNotPaused returns (bool x)
    {
        /** initial registration. first player to register is player1, second player to register is player2 */
        if (player1 == 0)
        {
            player1 = msg.sender;
            emit PlayerPhase(msg.sender,1);
            return true;
        }
        else if (player2 == 0)
        {
            player2 = msg.sender;
            emit PlayerPhase(msg.sender,1);
            return true;
        }
        return false;
    }

    function encrypt(string hand, string random) public notNotRegistered notStupid(hand) whenNotPaused returns (bool x)
    {
        /** Encrypts each players initial hands */
        if (msg.sender == player1)
        {
            player1HandHash = encodeTheSecret(hand,random);
            emit PlayerPhase(msg.sender,2);
            return true;
        }
        else if (msg.sender == player2)
        {
            player2HandHash = encodeTheSecret(hand,random);
            emit PlayerPhase(msg.sender,2);
            return true;
        }
        return false;
    }

    function decrypt(string hand, string random) public notNotRegistered notStupid(hand) whenNotPaused returns (bool x)
    {
        /** second player is given about 5 minutes to respond after first reveal */
        if (bytes(player1Hand).length == 0 && bytes(player2Hand).length == 0)
            countdownBegins == now;

        /** stores the players hand in easy readable format if encryption and hand match */
        if (msg.sender == player1 && encodeTheSecret(hand,random) == player1HandHash)
        {
            player1Hand = hand;
            emit PlayerPhase(msg.sender,3);
            return true;
        }
        if (msg.sender == player2 && encodeTheSecret(hand,random) == player2HandHash)
        {
            player2Hand = hand;
            emit PlayerPhase(msg.sender,3);
            return true;
        }
        return false;

    }

    function finish() public notNotRegistered whenNotPaused returns (int x)
    {
        if (bytes(player1Hand).length != 0 && bytes(player2Hand).length != 0) // This will trigger when both players have made a hand
        {
            int winner = results[player1Hand][player2Hand];
            if (winner == 1)
                /** player 1 rocks and gets the winnings */
                player1.transfer(address(this).balance);
            else if (winner == 2)
                /** player 2 probably didn't pick scissors */
                player2.transfer(address(this).balance);
            else
            {
                /** wait, nobody won? this game is shit */
                player1.transfer(address(this).balance/2);
                player2.transfer(address(this).balance);
            }

            /** reset everything ready for the next game */
            player1Hand = "";
            player2Hand = "";
            player1HandHash = "";
            player2HandHash = "";
            player1 = 0;
            player2 = 0;
            countdownBegins = 0;
            return winner;
        }
        else if (now > countdownBegins + 300)
        {
            /** someone got hit by a bus or doesnt want to play. Whoever revealed first is the winner. */
            if (bytes(player1Hand).length != 0)
                player1.transfer(address(this).balance);
            else if (bytes(player2Hand).length != 0)
                player2.transfer(address(this).balance);

            /** reset everything ready for the next game */
            player1Hand = "";
            player2Hand = "";
            player1HandHash = "";
            player2HandHash = "";
            player1 = 0;
            player2 = 0;
            countdownBegins = 0;
            return winner;
        }
        else
            return -1;
    }
    
    /** Internal game functions  */
    
    function compareStrings (string a, string b) private pure returns (bool)
    {
        /** or yanno, "==" */
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function encodeTheSecret(string a, string b) private pure returns (bytes32 x)
    {
        /** super secret hashing function hashes your hand and your secret, hence making it UNHACKABLE. I mean, just look at all the brackets */
        return keccak256(abi.encodePacked(keccak256(abi.encodePacked(a)) ^ keccak256(abi.encodePacked(b))));
    }
    
    /** External game functions */

    function whatPhaseAmI() external view returns (int x)
    {
        /** returns which phase the calling player is in */
        if (msg.sender == player1)
        {
            if (player1HandHash == 0)
                return 1;
            else if (bytes(player1Hand).length == 0 )
                return 2;
            else
                return 3;
        }
        else if (msg.sender == player2)
        {
            if (player2HandHash == 0)
                return 1;
            else if (bytes(player2Hand).length == 0 )
                return 2;
            else
                return 3;
        }
        else
            return 0;

    }

    function whatPhaseIsIt() external view returns (int x)
    {
        /** returns which phase the game is in from a global perspective */
        if (player1 == 0 || player2 == 0)
            return 0;
        else if (player1HandHash == 0 || player2HandHash == 0)
            return 1;
        else if (bytes(player1Hand).length == 0 || bytes(player2Hand).length == 0 )
            return 2;
        else
            return 3;
    }

    function whatPhaseAreThePlayers() external view returns (int x, int y)
    {
        /** returns which phase each of the players are in */
        int a;
        int b;
        if (player1 != 0)
        {
            if (player1HandHash == 0)
                a = 1;
            else if (bytes(player1Hand).length == 0 )
                a = 2;
            else
                a = 3;
        }
        if (player2 != 0)
        {
            if (player2HandHash == 0)
                b = 1;
            else if (bytes(player2Hand).length == 0 )
                b = 2;
            else
                b = 3;
        }
        return (a,b);
    }

    function whoIsPlayer1() external view returns (address x)
    {
        /** returns the address of player 1 */
        return player1;
    }
    
    function whoIsPlayer2() external view returns (address x)
    {
        /** returns the address of player 2 */
        return player2;
    }

    function getContractBalance () external view returns (uint x)
    {
        /** gets the contract balance. */
        return address(this).balance;
    }

    function destroy() public onlyOwner {
        /** I DON'T WANT TO PLAY THIS GAME ANYMORE */
        selfdestruct(owner);
    }

}