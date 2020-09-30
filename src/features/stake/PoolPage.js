import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { StakePool } from './sections';

export default function PoolPage(props) {
  const history = useHistory();
  const [index] = useState(Number(props.match.params.index) - 1);

  useEffect(() => {
    if (index != 3) return history.push('/stake');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, [index]);

  return <StakePool {...props} />;
}