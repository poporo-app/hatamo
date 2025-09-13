import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import BusinessRegistrationForm from '../BusinessRegistrationForm';
import { BUSINESS_CATEGORIES } from '@/types/business-registration';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BusinessRegistrationForm', () => {
  const mockPush = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders all required form fields', () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/所在地/)).toBeInTheDocument();
    expect(screen.getByLabelText(/連絡先電話番号/)).toBeInTheDocument();
    expect(screen.getByLabelText(/代表者名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/資本金/)).toBeInTheDocument();
    expect(screen.getByText(/カテゴリ/)).toBeInTheDocument();
  });

  it('displays all business categories as checkboxes', () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    BUSINESS_CATEGORIES.forEach(category => {
      expect(screen.getByLabelText(category.label)).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const submitButton = screen.getByText('次へ');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument();
      expect(screen.getByText('所在地は必須です')).toBeInTheDocument();
      expect(screen.getByText('電話番号は必須です')).toBeInTheDocument();
      expect(screen.getByText('代表者名は必須です')).toBeInTheDocument();
      expect(screen.getByText('カテゴリを少なくとも1つ選択してください')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const emailInput = screen.getByLabelText(/メールアドレス/);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const phoneInput = screen.getByLabelText(/連絡先電話番号/);
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText('有効な電話番号を入力してください')).toBeInTheDocument();
    });
  });

  it('allows multiple category selection', () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const itCheckbox = screen.getByLabelText('IT・テクノロジー');
    const consultingCheckbox = screen.getByLabelText('コンサルティング');

    fireEvent.click(itCheckbox);
    fireEvent.click(consultingCheckbox);

    expect(itCheckbox).toBeChecked();
    expect(consultingCheckbox).toBeChecked();
  });

  it('submits form with valid data', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/メールアドレス/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/所在地/), { target: { value: '東京都渋谷区テスト1-2-3' } });
    fireEvent.change(screen.getByLabelText(/連絡先電話番号/), { target: { value: '03-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/代表者名/), { target: { value: 'テスト太郎' } });
    fireEvent.click(screen.getByLabelText('IT・テクノロジー'));

    const submitButton = screen.getByText('次へ');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('企業情報が正常に保存されました');
      expect(mockPush).toHaveBeenCalledWith('/business/register/documents');
    });
  });

  it('disables submit button while loading', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/メールアドレス/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/所在地/), { target: { value: '東京都渋谷区テスト1-2-3' } });
    fireEvent.change(screen.getByLabelText(/連絡先電話番号/), { target: { value: '03-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/代表者名/), { target: { value: 'テスト太郎' } });
    fireEvent.click(screen.getByLabelText('IT・テクノロジー'));

    const submitButton = screen.getByText('次へ');
    fireEvent.click(submitButton);

    // Check if button shows loading state
    await waitFor(() => {
      expect(screen.getByText(/保存中/)).toBeInTheDocument();
    });
  });

  it('validates capital field accepts only positive numbers', async () => {
    render(<BusinessRegistrationForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const capitalInput = screen.getByLabelText(/資本金/);
    fireEvent.change(capitalInput, { target: { value: '-100' } });
    fireEvent.blur(capitalInput);

    await waitFor(() => {
      expect(screen.getByText('資本金は0以上の数値を入力してください')).toBeInTheDocument();
    });
  });
});