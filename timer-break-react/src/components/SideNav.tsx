import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faStopCircle, faCalendarAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons';

interface NavItemProps {
  active: boolean;
}

const NavContainer = styled.nav`
  background: #2c3e50;
  width: 250px;
  height: 100vh;
  padding: 20px 0;
  color: white;
`;

const NavHeader = styled.div`
  padding: 0 20px;
  margin-bottom: 30px;
  h1 {
    font-size: 24px;
    margin: 0;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<NavItemProps>`
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.active ? '#34495e' : 'transparent'};
  transition: background 0.3s;

  &:hover {
    background: #34495e;
  }

  svg {
    width: 20px;
  }
`;

interface SideNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'timer-section', icon: faClock, label: 'Timer' },
    { id: 'stop-section', icon: faStopCircle, label: 'Stop' },
    { id: 'calendar-section', icon: faCalendarAlt, label: 'Calendar' },
    { id: 'notes-section', icon: faStickyNote, label: 'Notes' },
  ];

  return (
    <NavContainer>
      <NavHeader>
        <h1>Timer Break</h1>
      </NavHeader>
      <NavLinks>
        {navItems.map(item => (
          <NavItem
            key={item.id}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavLinks>
    </NavContainer>
  );
};

export default SideNav; 