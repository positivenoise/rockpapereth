# Design pattern decisions

I thought doing a rock paper scissors game for my project would be pretty straightforward, its a 2 player game which doesn't require many moves to play and has a lot less variables, compared to something like tic tac to or chess. There is no need to track a gameboard, and players only have to select which hand they play. After drafting the original contract, I saw that creating a secure game would be anything but straightforward. All of the game flow design decisions were made with possible game states and player actions in mind. 

The challenge came with making the game secure if the hands are public. This changed the game from having 2 phases (register, pick, where after the 2nd player picks the game is finalized) to having 4 phases (register, encrypt, decrypt, finalize) and requiring the user to enter a secret key, in which their hand would be encrypted and stored with. The player can then reveal their hand once both players have played.

A further challenge came about with what happens when after a player reveals their hand, the other player realizes they will lose and decides to not decrypt their guess. A timer function of 5 minutes was added so a player can cash out if they are the only one who has decrypted their hand.

Open-Zeppelin Ownable and Pausable libraries are linked to provide a layer of security and control to the smart contract. This allows a selfdestruct function in case it catastrophically goes wrong and needs to die (onlyOwner can run this), and a Pausable function so all game functions can be paused, creating a circuit breaker function. 

Helper functions were all added out of necessity when building the front end interface. It may have been easier to figure out these parameters beforehand rather than rewriting the helper functions several times.

I am not a developer by trade so I found test driven development challenging, for this reason I used javascript testing methods as it was much easier to use multiple accounts and test exceptions. There is still no good documentation for testing exceptions in solidity so if you find an easy way GIVE IT TO ME.

I used Shards/Bootstrap for the frontend because it's what I'm comfortable with and it looks pretty. Particles.js library is also used because its awesome and you shouldn't dispute that.



