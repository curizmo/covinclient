import { useEffect, useState } from 'react';

import { requestOrganizations } from '../actions/organizations';
import { getOrganizations } from '../selectors';

const useOrganizationsList = ({ dispatch, useSelector }) => {
  const organizations = useSelector(getOrganizations);
  const [organizationsList, setOrganizationsList] = useState([]);

  useEffect(() => {
    dispatch(requestOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setOrganizationsList(
        organizations.map(({ Subdomain: value, OrganizationName: name }) => ({
          value,
          name,
        })),
      );
    } else {
      setOrganizationsList([]);
    }
  }, [organizations]);

  return {
    organizationsList,
  };
};

export { useOrganizationsList };
