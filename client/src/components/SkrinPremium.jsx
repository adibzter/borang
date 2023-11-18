import { Box } from '@mui/material';
import { purple } from '@mui/material/colors';

import Pricing from '../components/Pricing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import LoadingButton from '@mui/lab/LoadingButton';
import { signIn } from '../utils/firebase';
import { useUserStore } from '../stores/userStore';
import { useEffect, useState } from 'react';

const SkrinPremiumSubDescription = () => {
  return (
    <>
      <p>
        With only <s>$9.99</s> $4.99, you will get premium features for{' '}
        <b>ALL</b> of our products
      </p>
      <Box sx={{ textAlign: 'left' }}>
        <b>Borang</b>
        <ul>
          <li>Unlimited form submission</li>
          <li>Fast form submission</li>
          <li>No ads (coming soon)</li>
          <li>Support for mobile (coming soon)</li>
          <li>Support for form that require sign-in (coming soon)</li>
        </ul>

        <b>Sementara (coming soon)</b>
        <br />
        <br />
        <b>Skrin (coming soon)</b>
      </Box>
    </>
  );
};

const SkrinPremium = () => {
  const [isClicked, setIsClicked] = useState(false);

  const [isReady, userEmail, badges, isSignInLoading, setIsSignInLoading] =
    useUserStore((state) => [
      state.isReady,
      state.userEmail,
      state.badges,
      state.isSignInLoading,
      state.setIsSignInLoading,
    ]);

  useEffect(() => {
    if (isClicked && userEmail) {
      window.location.href = `https://buy.stripe.com/aEU14J22Ldx0dRS28f?prefilled_email=${userEmail}`;
    }
  }, [isClicked, userEmail]);

  const handleSkrinPremium = async () => {
    setIsClicked(true);
    setIsSignInLoading(true);

    if (!userEmail) {
      const userCredential = await signIn();
      setIsSignInLoading(false);

      if (!userCredential) {
        setIsClicked(false);
      }
    }
  };

  return (
    <>
      <Pricing
        title='Skrin Premium'
        description='Early Adopter Price'
        price={4.99}
        color={purple['400']}
        subDescription={<SkrinPremiumSubDescription />}
        Button={
          <LoadingButton
            variant='contained'
            color='secondary'
            startIcon={
              <FontAwesomeIcon
                icon={faMedal}
                fade
                style={{ animationDuration: '2s' }}
              />
            }
            onClick={handleSkrinPremium}
            loading={isSignInLoading}
            disabled={!isReady || badges?.includes('skrin-premium')}
          >
            Skrin Premium
          </LoadingButton>
        }
      />
    </>
  );
};

export default SkrinPremium;
