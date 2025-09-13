import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';

// Mock NextResponse.redirect and NextResponse.next
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    redirect: jest.fn((url) => ({ redirected: true, url })),
    next: jest.fn(() => ({ next: true })),
  },
}));

describe('Middleware', () => {
  const createRequest = (url: string, hasToken: boolean = false) => {
    const request = {
      nextUrl: {
        pathname: url,
      },
      url: `http://localhost:3002${url}`,
      cookies: {
        get: jest.fn((name: string) => 
          hasToken && name === 'auth_token' ? { value: 'test-token' } : undefined
        ),
      },
    } as unknown as NextRequest;
    return request;
  };

  describe('Non-business routes', () => {
    it('should pass through non-business routes', () => {
      const request = createRequest('/');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });

    it('should pass through user routes', () => {
      const request = createRequest('/user/dashboard');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });
  });

  describe('Business routes - Unauthenticated', () => {
    it('should redirect root business path to login when not authenticated', () => {
      const request = createRequest('/business');
      const response = middleware(request);
      expect(response).toEqual({
        redirected: true,
        url: new URL('/business/business-login', 'http://localhost:3002'),
      });
    });

    it('should redirect protected routes to login when not authenticated', () => {
      const request = createRequest('/business/dashboard');
      const response = middleware(request);
      expect(response).toEqual({
        redirected: true,
        url: expect.objectContaining({
          pathname: '/business/business-login',
          searchParams: expect.objectContaining({
            from: '/business/dashboard',
          }),
        }),
      });
    });

    it('should allow access to login page when not authenticated', () => {
      const request = createRequest('/business/business-login');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });

    it('should allow access to register page when not authenticated', () => {
      const request = createRequest('/business/business-register');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });
  });

  describe('Business routes - Authenticated', () => {
    it('should redirect root business path to dashboard when authenticated', () => {
      const request = createRequest('/business', true);
      const response = middleware(request);
      expect(response).toEqual({
        redirected: true,
        url: new URL('/business/dashboard', 'http://localhost:3002'),
      });
    });

    it('should allow access to dashboard when authenticated', () => {
      const request = createRequest('/business/dashboard', true);
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });

    it('should redirect login page to dashboard when authenticated', () => {
      const request = createRequest('/business/business-login', true);
      const response = middleware(request);
      expect(response).toEqual({
        redirected: true,
        url: new URL('/business/dashboard', 'http://localhost:3002'),
      });
    });

    it('should redirect register page to dashboard when authenticated', () => {
      const request = createRequest('/business/business-register', true);
      const response = middleware(request);
      expect(response).toEqual({
        redirected: true,
        url: new URL('/business/dashboard', 'http://localhost:3002'),
      });
    });
  });

  describe('Static files and API routes', () => {
    it('should pass through static files', () => {
      const request = createRequest('/business/logo.png');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });

    it('should pass through _next files', () => {
      const request = createRequest('/business/_next/static/chunk.js');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });

    it('should pass through API routes', () => {
      const request = createRequest('/business/api/auth');
      const response = middleware(request);
      expect(response).toEqual({ next: true });
    });
  });
});