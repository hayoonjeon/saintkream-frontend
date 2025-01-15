import React from 'react';
import HeaderTop from './HeaderTop';
import HeaderMain from './HeaderMain';
import HeaderNavi from '../headerNavi/page';

function Header({ searchQuery, onSearchChange , toggleNotibar}) {


  return (
    <div style={{display:'flex' , justifyContent:'center'}}>
    <div style={{width:'1280px', minWidth:'510px'}}>
      {/* <HeaderTop toggleNotibar={toggleNotibar}/> */}
      <HeaderTop toggleNotibar={toggleNotibar} />
      <HeaderMain searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <br/>
        <br/>
      <HeaderNavi/>
    </div>
    </div>
  );
}

export default Header;