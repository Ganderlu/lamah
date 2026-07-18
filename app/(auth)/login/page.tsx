'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import PasswordInput from '@/components/auth/PasswordInput';
import { auth, db } from '@/firebase/client';
import { Mail, Lock, MessageSquare } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      setSnackbar({
        open: true,
        message: 'Login successful! Welcome back.',
        severity: 'success',
      });
      router.push('/');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to login',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          photoURL: user.photoURL,
          role: 'customer',
          status: 'active',
          wishlist: [],
          cart: [],
          addresses: [],
          orders: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      setSnackbar({
        open: true,
        message: 'Login successful! Welcome back.',
        severity: 'success',
      });
      router.push('/');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to login',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setSnackbar({
        open: true,
        message: 'Password reset email sent! Check your inbox.',
        severity: 'success',
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send reset email',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 4, md: 6, lg: 8 },
          maxWidth: { xs: '100%', md: '600px' },
          mx: 'auto',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Image
              src="/images/lamahhlogo.png"
              alt="Lamah Clothing Co."
              width={160}
              height={64}
              priority
            />
          </Box>

          {!showForgotPassword ? (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Welcome Back 👋
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#A0A0A0',
                  mb: 4,
                }}
              >
                Login to your account and continue shopping the latest streetwear styles.
              </Typography>

              <Stack
                direction="row"
                sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Button
                  sx={{
                    flex: 1,
                    py: 2,
                    borderBottom: '3px solid #39FF14',
                    color: '#39FF14',
                    fontWeight: 700,
                    borderRadius: 0,
                  }}
                >
                  LOGIN
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  sx={{
                    flex: 1,
                    py: 2,
                    borderBottom: '3px solid transparent',
                    color: '#A0A0A0',
                    fontWeight: 700,
                    borderRadius: 0,
                    '&:hover': {
                      color: '#FFFFFF',
                    },
                  }}
                >
                  CREATE ACCOUNT
                </Button>
              </Stack>

              <Stack spacing={3} component="form" onSubmit={handleSubmit(handleLogin)}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      placeholder="Enter your email address"
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ mr: 1, color: '#39FF14' }}>
                            <Mail size={20} />
                          </Box>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: '#050505',
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                  <PasswordInput
                    label="Password"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    placeholder="Enter your password"
                  />
                  )}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={<Checkbox sx={{ color: '#39FF14' }} />}
                    label="Remember me"
                    sx={{ color: '#A0A0A0' }}
                  />
                  <Link
                    component="button"
                    onClick={() => setShowForgotPassword(true)}
                    sx={{
                      color: '#39FF14',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 2,
                    background: '#39FF14',
                    color: '#050505',
                    fontWeight: 700,
                    '&:hover': {
                      background: '#32e012',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#050505' }} />
                  ) : (
                    'LOGIN TO ACCOUNT'
                  )}
                </Button>
              </Stack>

              <Divider sx={{ my: 4 }}>
                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                  OR
                </Typography>
              </Divider>

              <Typography variant="body2" sx={{ color: '#A0A0A0', mb: 2, textAlign: 'center' }}>
                Continue with
              </Typography>

              <SocialLoginButtons
                onGoogleClick={handleGoogleSignIn}
              />

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#A0A0A0',
                    textAlign: 'center',
                  }}
                >
                  By continuing, you agree to our{' '}
                  <Link
                    href="#"
                    sx={{ color: '#39FF14', textDecoration: 'none' }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="#"
                    sx={{ color: '#39FF14', textDecoration: 'none' }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>

                <Stack direction="row" justifyContent="center" gap={2} mt={3}>
                  <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                    Need help?
                  </Typography>
                  <Link
                    href="/contact"
                    sx={{
                      color: '#39FF14',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <MessageSquare size={16} /> Contact Support
                  </Link>
                </Stack>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#A0A0A0',
                  mb: 4,
                }}
              >
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#050505',
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  sx={{
                    py: 2,
                    background: '#39FF14',
                    color: '#050505',
                    fontWeight: 700,
                    '&:hover': {
                      background: '#32e012',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#050505' }} />
                  ) : (
                    'SEND RESET EMAIL'
                  )}
                </Button>

                <Button
                  onClick={() => setShowForgotPassword(false)}
                  fullWidth
                  sx={{
                    py: 2,
                    color: '#A0A0A0',
                  }}
                >
                  Back to Login
                </Button>
              </Stack>
            </>
          )}
        </motion.div>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
