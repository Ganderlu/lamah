import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChange,
  error = false,
  helperText,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      label={label}
      type={showPassword ? 'text' : 'password'}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      sx={{
        '& .MuiOutlinedInput-root': {
          background: '#050505',
          borderRadius: 2,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              sx={{ color: '#A0A0A0' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
