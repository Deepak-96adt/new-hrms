import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermissions }) => {
  const permissions = useSelector((state) => state.auth.permissions) || [];

  // Log the permissions to the console
  console.log("User permissions:", permissions);
 console.log("Required permissions:", requiredPermissions);

  const hasPermission = requiredPermissions.every(permission => 
    permissions.includes(permission)
  );

  return hasPermission ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
