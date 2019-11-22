pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../interfaces/IERC677.sol";
import "../interfaces/IERC677Receiver.sol";
import "../libraries/Address.sol";

/*
*  @title: ERC677
*  @dev: Implements the ERC677 token standard.
*/
contract ERC677 is ERC20Mintable, IERC677 {

    using Address for address;

    event Transfer(
        address indexed from,
        address indexed to,
        uint value,
        bytes data
    );

    /*
    * @dev: Modifier which checks recipient validity.
    */
    modifier validRecipient(
        address _recipient
    )
    {
        require(
            _recipient != address(0) && _recipient != address(this),
            "Cannot transfer tokens to null address or self"
        );
        _;
    }

    /**
      * @dev transfer function which informs contract recipients of asset transfers
      * @param  _receiver      intended recipient of the transfer
      * @param  _amount        amount of tokens to be transferred
      * @param  _data          data payload containing the token contract address
      * @return                bool indicating if the transfer was successful
    */
    function transferAndCall(
        IERC677Receiver _receiver,
        uint _amount,
        bytes calldata _data
    )
        external
        validRecipient(address(_receiver))
        returns (bool)
    {
        // Transfer the tokens to the intended recipient
        require(
            transfer(address(_receiver), _amount),
            "ERC20 token transfer failed."
        );

        // If the recipient is a contract, call tokenFallback()
        if(address(_receiver).isContract()) {
            require(
                _receiver.tokenFallback(msg.sender, _amount, _data),
                "Token fallback failed."
            );
        }

        emit Transfer(
            msg.sender,
            address(_receiver),
            _amount,
            _data
        );

        return true;
    }
}