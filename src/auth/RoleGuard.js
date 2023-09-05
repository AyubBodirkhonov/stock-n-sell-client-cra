import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

RoleGuard.propTypes = {
  children: PropTypes.node,
};

export default function RoleGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  // write logic of allowed paths for certain user according his roles

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}
