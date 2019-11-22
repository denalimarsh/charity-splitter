pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../interfaces/IERC677.sol";
import "../interfaces/IERC677Receiver.sol";
import "../libraries/Address.sol";

contract ERC677 is ERC20Mintable, IERC677 {

    using Address for address;

    event Transfer(
        address indexed from,
        address indexed to,
        uint value,
        bytes data
    );

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

    // function superTransfer(
    //     address _to,
    //     uint256 _value
    // )
    //     public
    //     returns(bool)
    // {
    //     return super.transfer(
    //         _to,
    //         _value
    //     );
    // }

    function transferAndCall(
        IERC677Receiver receiver,
        uint amount,
        bytes calldata data
    )
        external
        validRecipient(address(receiver))
        returns (bool)
    {
        // Transfer the tokens to the intended recipient
        require(
            transfer(address(receiver), amount),
            "ERC20 token transfer failed."
        );

        // If the recipient is a contract, call tokenFallback()
        if(address(receiver).isContract()) {
            require(
                receiver.tokenFallback(msg.sender, amount, data),
                "Token fallback failed."
            );
        }

        emit Transfer(
            msg.sender,
            address(receiver),
            amount,
            data
        );

        return true;
    }
}