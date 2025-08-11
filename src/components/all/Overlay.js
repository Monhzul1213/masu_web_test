import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
LoadingOverlay.propTypes = undefined;

export function Overlay(props){
  const { className, loading, children } = props;

  let styles = { overlay: base => ({...base, background: 'rgba(0, 0, 0, 0.2)'}) };
  let overlay = { className, active: loading, spinner: true, styles };
  
  return (
    <LoadingOverlay {...overlay}>
      {children}
    </LoadingOverlay>
  );
}