/* eslint-disable max-len */
import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material';
import Section from '../../components/wraith9000/Section';
import SectionHeader from '../../components/wraith9000/SectionHeader';

const data = {
  title: 'Metaverse',
  subtitle: 'Web3 Gaming | Play-to-Earn | NFT Skins',
  data: [
    {
      headline: 'Dual-Token System',
      text: 'In-game token as the main currency for gameplay and rewards, plus $ARENA token for staking and rewarding players and holders.',
      image: '/assets/metaverse/wraith9000.png',
      link: '/projects/wraith9000',
    },
    {
      headline: 'NFT Skins',
      text: 'Unique NFT skins to customize your gameplay and enhance your player experience with exclusive looks.',
      image: '/assets/metaverse/tradingcards.png',
      link: '/projects/tradingcards',
    },
    {
      headline: 'Arena.Social Platform',
      text: 'Built for true player ownership and community-driven growth, launching soon on Arena.Social.',
      image: '/assets/metaverse/gameboy.png',
      link: '/projects/spacebots',
    },
  ],
}

const Metaverse: React.FC = () => (
  <Section id='metaverse' sx={{
    py: { xs: 4, sm: 6, md: 8, lg: 10 }, // Reduced padding on mobile
    px: { xs: 1, sm: 2, md: 3, lg: 4 }, // Better mobile padding
    // Safe area handling for mobile
    pt: { xs: 'calc(4rem + env(safe-area-inset-top))', sm: 4, md: 6, lg: 8 },
    pb: { xs: 'calc(4rem + env(safe-area-inset-bottom))', sm: 4, md: 6, lg: 8 },
  }}>
    <SectionHeader
      title={data.title}
      subtitle={data.subtitle}
      sx={{
        textAlign: 'center',
        alignItems: 'center',
        mb: { xs: 3, sm: 4, md: 6, lg: 8 }, // Reduced margin on mobile
        px: { xs: 1, sm: 2 }, // Better mobile padding
      }}
    />
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 3, sm: 4, md: 6, lg: 8 }}>
        {data.data.map((item, index) => (
          <Grid
            key={item.headline}
            item
            xs={12}
            sx={{
              mb: { xs: 3, sm: 4, md: 6, lg: 8 }, // Reduced margin on mobile
              // Add visual separation between items
              '&:not(:last-child)': {
                borderBottom: { xs: '1px solid rgba(255,255,255,0.1)', md: 'none' },
                pb: { xs: 3, sm: 4, md: 6, lg: 8 }
              }
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4, lg: 6 }} // Reduced spacing on mobile
              alignItems='center'
              direction={{ xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
            >
              {/* Content Column */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
                  textAlign: { xs: 'center', md: 'left' },
                  // Better mobile spacing
                  mb: { xs: 2, sm: 3, md: 0 },
                }}
              >
                <Typography
                  variant='h2'
                  sx={{
                    fontSize: {
                      xs: 'clamp(1.5rem, 5vw, 2rem)', // Smaller on very small screens
                      sm: 'clamp(1.75rem, 6vw, 2.5rem)',
                      md: 'clamp(2rem, 8vw, 3rem)',
                      lg: 'clamp(2.5rem, 10vw, 3.5rem)',
                      xl: '48px'
                    },
                    fontWeight: 900,
                    letterSpacing: { xs: 0.3, sm: 0.5, md: 1 },
                    mb: { xs: 1.5, sm: 2, md: 3 },
                    lineHeight: 1.2,
                    background: 'linear-gradient(135deg, #2effbf 0%, #ffe53b 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    // Better mobile text rendering
                    wordBreak: { xs: 'break-word', sm: 'normal' },
                    hyphens: { xs: 'auto', sm: 'none' },
                  }}
                >
                  {item.headline}
                </Typography>
                <Typography
                  variant='subtitle2'
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: {
                      xs: '0.85rem',
                      sm: '0.9rem',
                      md: '1rem',
                      lg: '1.1rem',
                      xl: '1.25rem'
                    },
                    lineHeight: 1.6,
                    maxWidth: { xs: '100%', md: '90%' },
                    fontWeight: 400,
                    letterSpacing: { xs: 0.2, sm: 0.3 },
                    // Better mobile readability
                    px: { xs: 0.5, sm: 0 },
                  }}
                >
                  {item.text}
                </Typography>
              </Grid>

              {/* Image Column */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  order: { xs: 2, md: index % 2 === 0 ? 2 : 1 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // Better mobile image positioning
                  mt: { xs: 1, sm: 2, md: 0 },
                }}
              >
                <Box
                  component='img'
                  src={item.image}
                  alt={item.headline}
                  loading="lazy"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: {
                      xs: '140px', // Smaller on very small screens
                      sm: '160px',
                      md: '200px',
                      lg: '240px',
                      xl: '280px'
                    },
                    width: 'auto',
                    height: 'auto',
                    filter: 'drop-shadow(0 8px 24px rgba(46, 255, 191, 0.3))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      filter: 'drop-shadow(0 12px 32px rgba(46, 255, 191, 0.4))',
                    },
                    // Enhanced mobile touch feedback
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    // Ensure proper aspect ratio
                    objectFit: 'contain',
                    // Better mobile accessibility
                    cursor: 'pointer',
                    // Ensure images don't overflow on very small screens
                    '@media (max-width: 360px)': {
                      maxHeight: '120px',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Section>
)

export default Metaverse
