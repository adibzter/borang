import { useEffect } from 'react';
import { Box, Button, Grid, Toolbar } from '@mui/material';
import { green } from '@mui/material/colors';

import ResponsiveAppBar from '../components/ResponsiveAppBar';
import PricingComponent from '../components/Pricing';
import SkrinPremium from '../components/SkrinPremium';

const Pricing = () => {
  useEffect(() => {
    document.title = 'Borang | Pricing';
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Box component='main' display='flex' flexDirection='column'>
        <h1 style={{ textAlign: 'center' }}>Pricing</h1>
        <Box display='flex' flexDirection='row'>
          <Grid container justifyContent='center'>
            <PricingComponent
              title='Normie'
              description='Use any of our products for free!'
              price={0}
              color={green['400']}
              subDescription={
                <p>
                  Free forever! You can use any of our products without sign in!
                </p>
              }
              Button={<Button variant='outlined'>Products</Button>}
            />
            <SkrinPremium />
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Pricing;
