import React from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

export default function SideDrawer({ children, show, onClick }) {
  const content = (
    <CSSTransition
      in={show}
      classNames='slide-in-left'
      timeout={200}
      mountOnEnter
      unmountOnExit>
      <aside className='side-drawer' onClick={onClick}>
        {children}
      </aside>
    </CSSTransition>
  );
  return createPortal(content, document.getElementById('drawer-hook'));
}
