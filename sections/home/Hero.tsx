/* eslint-disable max-len */
import React from 'react'
import { Box, Button, Container, Grid, Typography, Snackbar, Alert } from '@mui/material';
import Section from '../../components/wraith9000/Section';
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false })

const data = {
  title: 'Enter the Multiverse',
  subtitle: 'The Next-Gen Web3 Play-to-Earn Game on Arena.Social',
  buttonText: 'Play',
  image: '/assets/wraith9000.png',
}

const Hero: React.FC = () => {
  const [animationData, setAnimationData] = React.useState<{ default: any } | undefined>(undefined)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  React.useEffect(() => {
    // Only load animation data on client side to prevent hydration issues
    if (typeof window !== 'undefined') {
      import('../../public/assets/lottie.json').then((data) => setAnimationData(data))
    }
  }, [])

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  const handlePlayClick = () => {
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Section sx={{
      justifyContent: 'center',
      mt: { xs: 6, sm: 8, md: 10, lg: 12 }, // Reduced top margin on mobile
      mb: { xs: 3, sm: 4, md: 6, lg: 8 },
      minHeight: {
        xs: 'calc(100vh - 80px)',
        sm: 'calc(100vh - 120px)',
        md: 'calc(100vh - 160px)',
        lg: 'calc(100vh - 200px)'
      },
      display: 'flex',
      alignItems: 'center',
      // Better mobile padding
      px: { xs: 2, sm: 3, md: 4 },
      // Safe area handling for mobile
      pt: { xs: 'env(safe-area-inset-top)', sm: 0 },
      pb: { xs: 'env(safe-area-inset-bottom)', sm: 0 },

    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={{ xs: 3, sm: 4, md: 6, lg: 8 }} alignItems="center">
          {/* Content Column */}
          <Grid
            item
            xs={12}
            md={6}
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems={{ xs: 'center', md: 'flex-start' }}
            textAlign={{ xs: 'center', md: 'left' }}
            sx={{
              // Better mobile spacing
              mb: { xs: 2, sm: 3, md: 0 },
            }}
          >
            <Typography
              variant='h1'
              mb={{ xs: 2, sm: 3, md: 4 }}
              sx={{
                fontSize: {
                  xs: 'clamp(2rem, 6vw, 2.5rem)', // Smaller on very small screens
                  sm: 'clamp(2.5rem, 8vw, 3.5rem)',
                  md: 'clamp(3rem, 10vw, 4.5rem)',
                  lg: 'clamp(4rem, 12vw, 6rem)',
                  xl: '92px'
                },
                lineHeight: { xs: 1.1, sm: 1.05, md: 1 },
                fontWeight: 900,
                letterSpacing: { xs: 0.5, sm: 1, md: 2 },
                background: 'linear-gradient(135deg, #2effbf 0%, #ffe53b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(46, 255, 191, 0.3)',
                // Better mobile text rendering
                wordBreak: { xs: 'break-word', sm: 'normal' },
                hyphens: { xs: 'auto', sm: 'none' },
              }}
            >
              {data.title}
            </Typography>

            <Typography
              variant='subtitle1'
              mb={{ xs: 3, sm: 4, md: 5, lg: 6 }}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem',
                  lg: '1.25rem'
                },
                lineHeight: 1.6,
                maxWidth: { xs: '100%', md: '90%' },
                fontWeight: 400,
                letterSpacing: { xs: 0.3, sm: 0.5 },
                // Better mobile readability
                px: { xs: 1, sm: 0 },
              }}
            >
              {data.subtitle}
            </Typography>

            <Button
              key="play-button"
              variant="contained"
              size='large'
              color='secondary'
              onClick={handlePlayClick}
              suppressHydrationWarning
              sx={{
                backgroundColor: '#2effbf',
                color: '#000',
                fontFamily: 'Sarpanch, sans-serif',
                fontWeight: 900,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem',
                  lg: '1.25rem'
                },
                borderRadius: '28px',
                minHeight: {
                  xs: 52, // Better touch target on mobile
                  sm: 56,
                  md: 60,
                  lg: 64
                },
                px: { xs: 3, sm: 4, md: 5, lg: 6 },
                py: { xs: 1.5, sm: 2 },
                boxShadow: '0 8px 24px rgba(46, 255, 191, 0.4)',
                letterSpacing: { xs: 0.5, sm: 1 },
                textTransform: 'none',
                // Enhanced mobile touch feedback
                '&:hover': {
                  backgroundColor: '#1effaf',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(46, 255, 191, 0.5)',
                },
                '&:active': {
                  transform: 'translateY(0px) scale(0.98)',
                },
                transition: 'all 0.3s ease',
                // Ensure proper touch target on mobile
                minWidth: { xs: 180, sm: 200, md: 220, lg: 240 },
                // Better mobile accessibility
                '&:focus': {
                  outline: '2px solid #2effbf',
                  outlineOffset: '2px',
                },
              }}
            >
              {data.buttonText}
            </Button>
          </Grid>

          {/* Image Column - Hidden on mobile, shown on desktop */}
          <Grid
            item
            md={6}
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 500,
                position: 'relative',
                '& img': {
                  width: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 8px 24px rgba(46, 255, 191, 0.3))',
                }
              }}
              component='img'
              src={data.image}
              alt="Wraith9000 NFT Collection"
              loading="eager"
            />
          </Grid>
        </Grid>

        {/* Mobile Image - Shown only on mobile with better positioning */}
        <Grid
          item
          xs={12}
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            mt: { xs: 2, sm: 3 },
            mb: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: { xs: '70%', sm: '80%' },
              maxWidth: { xs: 250, sm: 300 },
              '& img': {
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 4px 12px rgba(46, 255, 191, 0.3))',
              }
            }}
            component='img'
            src={data.image}
            alt="Wraith9000 NFT Collection"
            loading="eager"
          />
        </Grid>

        {/* Animation - Desktop only */}
        <Grid
          item
          md={12}
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            textAlign: 'center',
            mt: 4,
          }}
        >
          {animationData && (
            <Lottie
              key="lottie-animation"
              onClick={scrollToBottom}
              loop
              play
              animationData={animationData}
              style={{
                width: '100%',
                maxWidth: 400,
                height: '100px',
                cursor: 'pointer',
              }}
            />
          )}
        </Grid>
      </Container>



      {/* Coming Soon Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{
            bgcolor: '#ffe53b',
            color: '#181f32',
            fontFamily: 'Sarpanch, sans-serif',
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 1,
            '& .MuiAlert-icon': {
              color: '#181f32',
            },
          }}
        >
          🎮 Game coming soon!
        </Alert>
      </Snackbar>
    </Section>
  )
}

export default Hero
