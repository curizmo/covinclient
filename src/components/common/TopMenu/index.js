import React, { useState, useEffect, useCallback } from 'react';
import { Nav } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

import { MobileDropdownMenu } from './MobileDropdownMenu';
import { UserDropdownMenu } from './UserDropdownMenu';
import { LogoButton } from './LogoButton';

import useCheckIsMobile from 'hooks/useCheckIsMobile';
import { routes } from 'routers';

const TopMenu = () => {
  const isMobile = useCheckIsMobile();
  const [currentTab, setCurrentTab] = useState('');
  const location = useLocation();
  const [isShowMenu, setIsShowMenu] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      goTo: routes.dashboard.path,
    },
    {
      name: 'Patients',
      goTo: routes.patients.path,
    },
  ];

  const getIsActive = useCallback(
    (itemPath) => {
      if (itemPath === routes.dashboard.path) {
        return itemPath === currentTab || currentTab.includes('dashboard');
      }
      return currentTab.includes(itemPath);
    },
    [currentTab],
  );

  useEffect(() => {
    setCurrentTab(location.pathname);
    setIsShowMenu(
      ![routes.nonPhysician.path, routes.login.path].includes(
        location.pathname,
      ),
    );
  }, [location.pathname]);

  return (
    <header className="sticky-top d-flex justify-content-between align-items-center shadow-sm w-100 top-menu">
      {isMobile ? (
        <>
          <div className="d-flex top-menu-list">
            {isShowMenu && (
              <MobileDropdownMenu
                menuItems={menuItems}
                getIsActive={getIsActive}
              />
            )}
            <LogoButton />
          </div>
          <UserDropdownMenu />
        </>
      ) : (
        <>
          <LogoButton />
          {isShowMenu && (
            <Nav className="align-items-center top-menu-list h-100">
              {menuItems.map((item) => (
                <Link
                  className={`nav-link h-100 ${
                    getIsActive(item.goTo) ? 'active' : ''
                  }`}
                  key={item.name}
                  to={item.goTo}>
                  {item.name}
                </Link>
              ))}
            </Nav>
          )}
          <UserDropdownMenu />
        </>
      )}
    </header>
  );
};

export { TopMenu };
