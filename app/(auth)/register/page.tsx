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
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import PasswordInput from '@/components/auth/PasswordInput';
import { auth, db } from '@/firebase/client';
import { User, Phone, Globe } from 'lucide-react';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phone: z.string().optional(),
    country: z.string().optional(),
    gender: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
  'India',
  'Brazil',
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: '',
      gender: '',
      terms: false,
    },
  });

  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        gender: data.gender,
        role: 'customer',
        status: 'active',
        wishlist: [],
        cart: [],
        addresses: [],
        orders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setSnackbar({
        open: true,
        message: 'Registration successful! Welcome to Lamah.',
        severity: 'success',
      });
      router.push('/');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to register',
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
        message: 'Login successful! Welcome.',
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
          overflowY: 'auto',
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

          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Create Your Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#A0A0A0',
              mb: 4,
            }}
          >
            Join the Lamah community and enjoy exclusive drops, premium collections, and member-only offers.
          </Typography>

          <Stack
            direction="row"
            sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Button
              onClick={() => router.push('/login')}
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
              LOGIN
            </Button>
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
              CREATE ACCOUNT
            </Button>
          </Stack>

          <Stack spacing={3} component="form" onSubmit={handleSubmit(handleRegister)}>
            <Stack direction="row" gap={2}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#050505',
                        borderRadius: 2,
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#39FF14' }}>
                          <User size={20} />
                        </Box>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#050505',
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            </Stack>

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
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#050505',
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ mr: 1, color: '#39FF14' }}>
                        <Phone size={20} />
                      </Box>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Country"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#050505',
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ mr: 1, color: '#39FF14' }}>
                        <Globe size={20} />
                      </Box>
                    ),
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
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
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  label="Confirm Password"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />

            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      sx={{ color: '#39FF14' }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" sx={{ color: '#39FF14' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" sx={{ color: '#39FF14' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ color: errors.terms ? '#FF4D4F' : '#A0A0A0' }}
                />
              )}
            />

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
                'CREATE ACCOUNT'
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

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
              Already have an account?{' '}
              <Link
                component="button"
                onClick={() => router.push('/login')}
                sx={{
                  color: '#39FF14',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
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
