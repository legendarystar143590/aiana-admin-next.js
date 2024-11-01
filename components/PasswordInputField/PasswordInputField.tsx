import React,{useState} from 'react';
import EyeOutlined from '@ant-design/icons/lib/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined';
import {OutlinedInput, InputAdornment, IconButton} from '@mui/material';

const PasswordInputField = ({id, value, placeholder, handleChange}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <OutlinedInput
      id={id}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(e)=>handleChange(id, e.target.value)}
      placeholder={placeholder}
      className="rounded-lg border-gray-400 w-full h-12 focus:outline-none focus:shadow-none focus:border-none"
      sx={{
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#808080',
          borderWidth: '1px',
          boxShadow: '0 0 0 0.1px rgba(30, 30, 30, 0.1)'
        },
        '& .MuiOutlinedInput-input': {
          // Input field styles here
          backgroundColor: 'white',
          color: '#333',
          fontSize: '16px',
          padding: '10px',
          outline: 'none',
          border: 'none',
        }
      }}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            color="default"
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}
export default PasswordInputField
