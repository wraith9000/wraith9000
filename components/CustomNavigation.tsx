import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useWeb3Context } from '../hooks/Web3Context';

interface MenuItem {
  label: string;
  href: string;
  isComingSoon?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Staking', href: '/staking' },
  { label: 'Flywheel', href: '/flywheel', isComingSoon: true },
];

const CustomNavigation: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isConnected, account, connectWallet, disconnectWallet, error } = useWeb3Context();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  const handleMenuClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    setDrawerOpen(false);
    if (item.isComingSoon) {
      setSnackbarMessage('🚀 Flywheel coming soon!');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } else {
      router.push(item.href);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setSnackbarMessage('Wallet connected successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage(error || 'Failed to connect wallet');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setSnackbarMessage('Wallet disconnected');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  return (
    <>
      {/* Desktop Navigation Menu Items */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: { md: 100, lg: 120 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1300,
            display: 'flex',
            gap: 3,
          }}
        >
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Button
                key={item.href}
                onClick={() => {
                  if (item.isComingSoon) {
                    setSnackbarMessage('🚀 Flywheel coming soon!');
                    setSnackbarSeverity('info');
                    setSnackbarOpen(true);
                  } else {
                    router.push(item.href);
                  }
                }}
                sx={{
                  color: isActive ? '#181f32' : '#fff',
                  bgcolor: isActive ? '#ffe53b' : 'rgba(255,255,255,0.1)',
                  fontFamily: 'Sarpanch, sans-serif',
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: 2,
                  borderRadius: '20px',
                  px: 3,
                  py: 1.5,
                  minWidth: 100,
                  height: 38,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: isActive ? '#ffe53b' : 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  transition: 'all 0.2s ease',
                }}
                disableElevation
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      )}

      {/* Connect Button - floating top right, better mobile positioning */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: { md: 100, lg: 120 }, // Moved lower and more inside
            right: { md: 140, lg: 160 }, // Moved more inside
            zIndex: 1300,
          }}
        >
          {isConnected ? (
            <Button
              variant="outlined"
              size="small"
              onClick={handleDisconnectWallet}
              sx={{
                borderColor: '#ff6b6b',
                color: '#ff6b6b',
                fontFamily: 'Sarpanch, sans-serif',
                fontWeight: 900,
                borderRadius: '20px',
                minWidth: 110,
                height: 38,
                px: 3,
                fontSize: 16,
                letterSpacing: 2,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                  borderColor: '#ff6b6b',
                  bgcolor: 'rgba(255, 107, 107, 0.1)',
                },
              }}
            >
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />}
              onClick={handleConnectWallet}
              sx={{
                bgcolor: '#ffe53b',
                color: '#181f32',
                fontFamily: 'Sarpanch, sans-serif',
                fontWeight: 900,
                borderRadius: '20px',
                minWidth: 110,
                height: 38,
                px: 3,
                fontSize: 16,
                boxShadow: 2,
                letterSpacing: 2,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': { bgcolor: '#ffe53b', opacity: 0.92 },
              }}
              disableElevation
            >
              Connect
            </Button>
          )}
        </Box>
      )}

      {/* Hamburger menu for mobile with improved touch target */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 32, sm: 40 }, // Moved lower and more inside
            right: { xs: 32, sm: 40 }, // Moved more inside
            zIndex: 1400,
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen((open) => !open)}
            sx={{
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              p: 1.5,
              minWidth: { xs: 48, sm: 52 }, // Better touch target
              minHeight: { xs: 48, sm: 52 }, // Better touch target
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '&:focus': {
                outline: '2px solid #2effbf',
                outlineOffset: '2px',
              },
              transition: 'all 0.2s ease',
            }}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
          >
            {drawerOpen ? (
              <CloseIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            ) : (
              <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            )}
          </IconButton>
        </Box>
      )}

      {/* Enhanced Drawer for mobile menu with better UX */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            height: 'auto',
            alignSelf: 'flex-start',
            width: { xs: '100%', sm: 320 },
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }
        }}
        id="mobile-menu"
      >
        <Box
          sx={{
            width: '100%',
            bgcolor: 'rgba(26, 37, 61, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            pt: { xs: 10, sm: 12 }, // Better mobile positioning
            px: { xs: 2, sm: 3 }, // Better mobile padding
            pb: 4,
            // Safe area handling
            paddingTop: { xs: 'calc(10rem + env(safe-area-inset-top))', sm: 12 },
            paddingBottom: { xs: 'calc(4rem + env(safe-area-inset-bottom))', sm: 4 },
            position: 'relative', // Added for close button positioning
          }}
          role="presentation"
        >
          {/* Close button inside the menu */}
          <IconButton
            onClick={handleMenuClose}
            sx={{
              position: 'absolute',
              top: { xs: 16, sm: 20 },
              right: { xs: 16, sm: 20 },
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              p: 1.5,
              minWidth: { xs: 44, sm: 48 },
              minHeight: { xs: 44, sm: 48 },
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '&:focus': {
                outline: '2px solid #2effbf',
                outlineOffset: '2px',
              },
              transition: 'all 0.2s ease',
              zIndex: 1,
            }}
            aria-label="Close navigation menu"
          >
            <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          {/* Menu Items with improved touch targets */}
          <Box sx={{ width: '100%', mt: 2, flex: 1 }}>
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Box
                  key={item.href}
                  onClick={() => handleMenuItemClick(item)}
                  sx={{
                    py: { xs: 2.5, sm: 3 }, // Better mobile spacing
                    px: { xs: 3, sm: 4 }, // Better mobile padding
                    borderRadius: '16px',
                    color: isActive ? '#181f32' : '#fff',
                    bgcolor: isActive ? '#ffe53b' : 'transparent',
                    fontFamily: 'Sarpanch, sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: 18, sm: 20 }, // Better mobile font size
                    letterSpacing: { xs: 1, sm: 2 },
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    mb: { xs: 1.5, sm: 2 }, // Better mobile spacing
                    minHeight: { xs: 52, sm: 56 }, // Better touch target
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      bgcolor: isActive ? '#ffe53b' : 'rgba(255,255,255,0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    '&:focus': {
                      outline: '2px solid #2effbf',
                      outlineOffset: '2px',
                    },
                  }}
                  role="menuitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMenuItemClick(item);
                    }
                  }}
                >
                  {item.label}
                </Box>
              );
            })}
          </Box>

          {/* Mobile Connect Button */}
          <Box sx={{ width: '100%', mt: 2, px: { xs: 3, sm: 4 } }}>
            {isConnected ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleDisconnectWallet}
                sx={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  fontFamily: 'Sarpanch, sans-serif',
                  fontWeight: 900,
                  borderRadius: '20px',
                  height: { xs: 52, sm: 56 }, // Better touch target
                  fontSize: { xs: 16, sm: 18 },
                  letterSpacing: 2,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': {
                    borderColor: '#ff6b6b',
                    bgcolor: 'rgba(255, 107, 107, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  '&:focus': {
                    outline: '2px solid #2effbf',
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />}
                onClick={handleConnectWallet}
                sx={{
                  bgcolor: '#ffe53b',
                  color: '#181f32',
                  fontFamily: 'Sarpanch, sans-serif',
                  fontWeight: 900,
                  borderRadius: '20px',
                  height: { xs: 52, sm: 56 }, // Better touch target
                  fontSize: { xs: 16, sm: 18 },
                  boxShadow: 2,
                  letterSpacing: 2,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': {
                    bgcolor: '#ffe53b',
                    opacity: 0.92,
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  '&:focus': {
                    outline: '2px solid #2effbf',
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.2s ease',
                }}
                disableElevation
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Wallet Connection Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            bgcolor: snackbarSeverity === 'error' ? '#ff6b6b' : '#ffe53b',
            color: snackbarSeverity === 'error' ? '#fff' : '#181f32',
            fontFamily: 'Sarpanch, sans-serif',
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 1,
            '& .MuiAlert-icon': {
              color: snackbarSeverity === 'error' ? '#fff' : '#181f32',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomNavigation; 