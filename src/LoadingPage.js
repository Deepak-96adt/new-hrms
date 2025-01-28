import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';


export default function LoadingPage() {
 
  const styleContainer = {
    position: 'fixed',
    top: 0,          
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    backdropFilter: 'blur(1px)',
    zIndex: 2
  };

  return (
    <div style={styleContainer}>
      <div style={{
          display: 'flex',  
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%', 
        }}
      > 
        <MoonLoader
          color='black'
          size={50}
          aria-label="Loading Spinner"
        />
      </div>
    </div>
  );
}
