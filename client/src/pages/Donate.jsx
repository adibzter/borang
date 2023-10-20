import { Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const Donate = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Box
        component='main'
        display='flex'
        justifyContent='center'
        minHeight='90vh'
        alignItems='center'
        flexDirection='column'
      >
        <h1>💗Thanks For the Donation💗</h1>
        <h2>
          We appreciate very much your contribution to this open source project
        </h2>
      </Box>
    </>
  );
};

export default Donate;
