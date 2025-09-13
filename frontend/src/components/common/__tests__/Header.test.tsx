import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header', () => {
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/business');
    jest.clearAllMocks();
  });

  describe('Business Header', () => {
    it('shows login button when not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });

      render(<Header role="business" />);
      
      const loginLink = screen.getByText('ログイン');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/business/business-login');
    });

    it('shows user menu with logout when authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        user: {
          firstName: '太郎',
          lastName: '山田',
          email: 'test@example.com',
        },
        logout: mockLogout,
      });

      render(<Header role="business" />);
      
      // Check user name is displayed
      expect(screen.getByText('山田 太郎')).toBeInTheDocument();
      
      // Open user menu
      const userButton = screen.getByText('山田 太郎').closest('button');
      fireEvent.click(userButton!);
      
      // Check logout button exists
      const logoutButton = screen.getByText('ログアウト');
      expect(logoutButton).toBeInTheDocument();
    });

    it('calls logout function when logout button is clicked', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        user: {
          firstName: '太郎',
          lastName: '山田',
          email: 'test@example.com',
        },
        logout: mockLogout,
      });

      render(<Header role="business" />);
      
      // Open user menu
      const userButton = screen.getByText('山田 太郎').closest('button');
      fireEvent.click(userButton!);
      
      // Click logout
      const logoutButton = screen.getByText('ログアウト');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('shows business registration link when not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });

      render(<Header role="business" />);
      
      const registerLink = screen.getByText('事業者登録');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/business/register');
    });

    it('hides business registration link when authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        user: {
          firstName: '太郎',
          lastName: '山田',
          email: 'test@example.com',
        },
        logout: mockLogout,
      });

      render(<Header role="business" />);
      
      expect(screen.queryByText('事業者登録')).not.toBeInTheDocument();
    });
  });

  describe('User Header', () => {
    it('shows correct login link for user role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });

      render(<Header role="user" />);
      
      const loginLink = screen.getByText('ログイン');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('Admin Header', () => {
    it('shows correct login link for admin role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });

      render(<Header role="admin" />);
      
      const loginLink = screen.getByText('ログイン');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/admin/login');
    });
  });
});