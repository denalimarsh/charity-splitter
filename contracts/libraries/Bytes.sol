pragma solidity ^0.5.0;

/**
 * @dev Collection of functions related to the bytes type.
 *
 */
library Bytes {
    /**
     * @dev Converts type `bytes` into `address`.
     *
     * _Available since v2.4.0._
     */
    function bytesToAddress(
        bytes memory _bytes
    )
        internal
        pure
        returns (address tempAddress)
    {
        require(
            _bytes.length >= 20,
            "Must be at least 20 bytes."
        );

        // solhint-disable-next-line no-inline-assembly
        assembly {
            tempAddress := div(mload(add(_bytes, 0x20)), 0x1000000000000000000000000)
        }
    }
}
