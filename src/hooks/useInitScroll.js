import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const useInitScroll = () => {
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history.location.pathname]);
};

export { useInitScroll };
