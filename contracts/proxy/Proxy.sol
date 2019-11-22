
pragma solidity ^0.5.0;

import "./ProxyAddress.sol";

/*
*  @title: Proxy
*  @dev: Proxy contract for CharitySplitterV2. The proxy contract uses delegate call
*        to invoke methods and does not have to  explicitly know the method signatures
*        of the target proxied contract.
*/
contract Proxy is ProxyAddress {
    /*
    *  @dev: Constructor, sets proxied address
    */
    constructor(
        address _proxied
    )
        public
    {
        proxied = _proxied;
    }

    /*
    *  @dev: Default function which uses delegate call to execute msg.data on the
    *        target proxied contract.
    */
    function ()
        external
        payable
    {
        address addr = proxied;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let freememstart := mload(0x40)
            calldatacopy(freememstart, 0, calldatasize())
            let success := delegatecall(not(0), addr, freememstart, calldatasize(), freememstart, 0)
            returndatacopy(freememstart, 0, returndatasize())
            switch success
            case 0 { revert(freememstart, returndatasize()) }
            default { return(freememstart, returndatasize()) }
        }
    }
}