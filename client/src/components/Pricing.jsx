import { Grid } from '@mui/material';

const Pricing = ({
  title,
  description,
  price,
  color,
  subDescription,
  Button,
}) => {
  return (
    <>
      <Grid
        item
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '20rem',
          paddingX: 2,
          paddingY: 2,
          margin: 1,
          border: 'solid 1px black',
          borderRadius: '8px',
        }}
      >
        <b>{title}</b>
        <p>{description}</p>
        <b style={{ fontSize: '3rem', color: color }}>${price}</b>
        <sub>/month</sub>
        {subDescription}
        {Button}
      </Grid>
    </>
  );
};

export default Pricing;
