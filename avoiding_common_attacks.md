# Avoiding common attacks

## Exposed Functions

Contracts can be marked as public when meant to be internal. This can cause unexpected contract execution.

I have mitigated against this risk by:

- Creating tests for all game functions testing accessibility
- Audited contract functions to ensure they are marked correctly

## Logic Bugs

Simple programming bugs can cause unexpected results, especially for edge cases.

I have mitigated against this risk by:

- Creating tests for all game functions ensuring results are correctly returned
- Following Solidity coding standards and general coding best practices
- Avoided overly complex functions and phases

## Exposed secrets

All code and data on the blockchain is public, so data like player choices are accessible by anyone. Any confidential data stored is accessible by any party.

I have mitigated against this risk by:

- storing confidential data with a player provided encryption key
- using secure cryptography algorithms (sha3)

## Game timer

Players may not like losing and decide to pause the game by not playing any further when a player first reveals his hand.

I have mitigated against this risk by:

- implementing a game timer so a player can win after 5 minutes even if the other player has stopped responding
- the time does not need to be specific to 5 minutes so block time can be used

## Poison Data

If data like the player choices are not as expected this could cause unwanted results.

I have mitigated against this risk by:

- implementing string validation and reverting the transaction on failure

## Tx.origin

The use of `tx.origin` can be dangerous and should not be trusted.

I have mitigated against this risk by:

- using `msg.sender` in place of `tx.origin`

## Circuit breaker

Unexpected things can go wrong. We need to be ready for anything. Rock paper scissor games are prime targets for organizations like China and that guy Nick so we need to always have the upper hand.

I have mitigated against this risk by:

- Implementing the Ownable and Pausable open-zeppelin libraries to provide a layer of control and security