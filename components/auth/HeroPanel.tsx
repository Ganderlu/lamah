import React from 'react';
import { Box, Typography, Avatar, IconButton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Star, ShieldCheck } from 'lucide-react';
import FeatureCard from './FeatureCard';

const HeroPanel: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 6,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.7) 100%)',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Bebas Neue, cursive',
              fontSize: { md: '4rem', lg: '5rem' },
              letterSpacing: '0.1em',
              lineHeight: 1,
              mb: 2,
            }}
          >
            JOIN THE
            <br />
            <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>
              MOVEMENT
            </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#A0A0A0',
              fontFamily: 'Poppins, sans-serif',
              maxWidth: 400,
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            Be part of a community that lives and breathes streetwear. Exclusive drops, premium quality, bold style.
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FeatureCard
          title="Exclusive Access"
          description="Get early access to new drops and limited collections."
          icon={<Gift size={24} />}
          delay={0.2}
        />
        <FeatureCard
          title="Special Offers"
          description="Enjoy member-only discounts and exclusive offers."
          icon={<Star size={24} />}
          delay={0.4}
        />
        <FeatureCard
          title="VIP Experience"
          description="Fast shipping, easy returns, and premium support."
          icon={<ShieldCheck size={24} />}
          delay={0.6}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box
            sx={{
              p: 3,
              background: 'rgba(17, 17, 17, 0.8)',
              border: '1px solid rgba(57,255,20,0.2)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <Stack direction="row" sx={{ ml: -1 }}>
                {[1, 2, 3].map((i) => (
                  <Avatar
                    key={i}
                    sx={{
                      width: 48,
                      height: 48,
                      border: '3px solid #050505',
                      ml: i > 1 ? -2 : 0,
                    }}
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1507003211169-0a1dd7228f2d' : i === 2 ? '1500648767791-00dcc994a43e' : '1506794778202-cad84cf45f1d'}?w=100&h=100&fit=crop`}
                  />
                ))}
              </Stack>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Join 50,000+ members
                </Typography>
                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                  and elevate your style today.
                </Typography>
              </Box>
            </Stack>
            <IconButton
              sx={{
                background: 'rgba(57,255,20,0.1)',
                color: '#39FF14',
                border: '2px solid #39FF14',
                '&:hover': {
                  background: '#39FF14',
                  color: '#050505',
                },
              }}
            >
              <ArrowRight size={28} />
            </IconButton>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default HeroPanel;
