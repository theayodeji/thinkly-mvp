import type { Response } from 'express';

export const setAuthTokens = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Production: HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return { accessToken: '', refreshToken: '' }; // 
  }
  
  // Production: HTTP-only cookies
  res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return { accessToken: '', refreshToken: '' }; // 
  }
  
  // Development: Return tokens in response body
