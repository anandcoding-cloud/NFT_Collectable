// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721.sol";

/**
 * The Color contract does this and that...
 */
contract Color is ERC721 {

	string[] public colors;
	mapping(string => bool) _colorExists;

  constructor() ERC721("Color","COLOR") public {  
  }
  function totalSupply() public view returns (uint) {
    return colors.length;
  }

  function mint(string memory _color) public {
  	//Generate unique ID
    require(!_colorExists[_color],'Color Already Exisit');
  	colors.push( _color );
  	uint _id = colors.length;
  	//Mint 
  	_mint(msg.sender, _id);
  	_colorExists[_color] = true;
  }
}

