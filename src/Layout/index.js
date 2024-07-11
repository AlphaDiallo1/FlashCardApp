import React from "react";
import Header from "./Header";
import RootRoutes from './RootRoutes';


function Layout() {
  return (
     <React.Fragment>
      <Header />
      <div className="container">
        <RootRoutes />
      </div>
     </React.Fragment>
  );
}

export default Layout;