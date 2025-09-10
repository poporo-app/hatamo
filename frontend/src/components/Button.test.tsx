import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant classes by default', () => {
    render(<Button label="Primary Button" />);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-500');
  });

  it('applies secondary variant classes', () => {
    render(<Button label="Secondary Button" variant="secondary" />);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-gray-300');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button label="Small" size="small" />);
    expect(screen.getByText('Small')).toHaveClass('px-3', 'py-1');

    rerender(<Button label="Medium" size="medium" />);
    expect(screen.getByText('Medium')).toHaveClass('px-4', 'py-2');

    rerender(<Button label="Large" size="large" />);
    expect(screen.getByText('Large')).toHaveClass('px-6', 'py-3');
  });
});