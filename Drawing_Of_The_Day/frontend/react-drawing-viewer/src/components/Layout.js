import Outlet from 'react-router-dom';

const Layout = () => {
    return (
        <>
          <NavBar />
          <Outlet />
        </>
    );
};

export default Layout;