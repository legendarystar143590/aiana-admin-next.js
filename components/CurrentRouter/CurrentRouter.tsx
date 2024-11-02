import React from 'react';
import { useRouter } from 'next/router';

const CurrentRouter = () => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <div>
      This is the current router: {pathname}
    </div>
  );
};
export default CurrentRouter;