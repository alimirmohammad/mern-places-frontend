import React from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';
import './Modal.css';

function ModalOverlay({
  className,
  style,
  headerClass,
  header,
  onSubmit,
  contentClass,
  footerClass,
  children,
  footer,
}) {
  const content = (
    <div className={`modal ${className}`} style={style}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={onSubmit ? onSubmit : event => event.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
      </form>
    </div>
  );
  return createPortal(content, document.getElementById('modal-hook'));
}

export default function Modal({ show, onCancel, ...props }) {
  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        timeout={200}
        classNames='modal'
        mountOnEnter
        unmountOnExit>
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
}
