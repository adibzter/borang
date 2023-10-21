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
      <p>You will get premium features for ALL of our products</p>
      <Box sx={{ textAlign: 'left' }}>
        <b>Borang</b>
        <ul>
          <li>No ads</li>
          <li>Unlimited form submission</li>
          <li>Support for mobile (Soon)</li>
          <li>Support for form that require sign-in (Soon)</li>
          <li>More in the future...</li>
        </ul>

        <b>Sementara</b>
        <ul>
          <li>No ads</li>
          <li>More in the future...</li>
        </ul>

        <b>Skrin</b>
        <ul>
          <li>No ads</li>
          <li>More in the future...</li>
        </ul>
      </Box>
    </>
  );
};

const SkrinPremium = () => {
  const [isClicked, setIsClicked] = useState(false);

  const [
    userEmail,
    isSignInLoading,
    setUserEmail,
    setUserDisplayName,
    setUserPhotoUrl,
    setIsSignInLoading,
  ] = useUserStore((state) => [
    state.userEmail,
    state.isSignInLoading,
    state.setUserEmail,
    state.setUserDisplayName,
    state.setUserPhotoUrl,
    state.setIsSignInLoading,
  ]);

  useEffect(() => {
    if (isClicked && userEmail) {
      window.location.href = `https://buy.stripe.com/test_7sIbLa1BQ08EbeM6op?prefilled_email=${userEmail}`;
    }
  }, [isClicked, userEmail]);

  const handleSkrinPremium = async () => {
    setIsClicked(true);
    setIsSignInLoading(true);

    if (!userEmail) {
      const userCredential = await signIn();

      if (!userCredential) {
        setIsClicked(false);
        setIsSignInLoading(false);
        return;
      }
      setUserEmail(userCredential.user.email);
      setUserDisplayName(userCredential.user.displayName);
      setUserPhotoUrl(userCredential.user.photoURL);
    }
  };

  return (
    <>
      <Pricing
        title='Skrin Premium'
        description='Get premium features'
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
          >
            Skrin Premium
          </LoadingButton>
        }
      />
    </>
  );
};

export default SkrinPremium;
