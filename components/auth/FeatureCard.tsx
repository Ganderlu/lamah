import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          background: 'rgba(17, 17, 17, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(57,255,20,0.15)',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            color: '#39FF14',
            p: 1.5,
            background: 'rgba(57,255,20,0.05)',
            borderRadius: '50%',
            border: '1px solid rgba(57,255,20,0.2)',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#A0A0A0',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {description}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
