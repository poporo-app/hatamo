'use client';

import { useEffect, useRef, useState } from 'react';

interface ReCaptchaProps {
  siteKey?: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  onVerify?: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (element: HTMLElement, options: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

export default function ReCaptcha({
  siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  theme = 'light',
  size = 'normal',
  onVerify,
  onExpired,
  onError,
  className = '',
  disabled = false,
}: ReCaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadScript = () => {
      // Check if script is already loaded
      if (window.grecaptcha) {
        setIsLoaded(true);
        return;
      }

      // Check if script element already exists
      if (document.querySelector('script[src*="recaptcha"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setError('reCAPTCHAの読み込みに失敗しました');
      document.head.appendChild(script);
    };

    loadScript();
  }, []);

  // Initialize reCAPTCHA widget
  useEffect(() => {
    if (!isLoaded || !recaptchaRef.current || !siteKey || disabled) return;

    const initializeRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          try {
            if (recaptchaRef.current) {
              const id = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                theme,
                size,
                callback: (token: string) => {
                  onVerify?.(token);
                },
                'expired-callback': () => {
                  onExpired?.();
                },
                'error-callback': () => {
                  setError('reCAPTCHA検証中にエラーが発生しました');
                  onError?.();
                },
              });
              setWidgetId(id);
            }
          } catch (err) {
            setError('reCAPTCHAの初期化に失敗しました');
            onError?.();
          }
        });
      }
    };

    initializeRecaptcha();
  }, [isLoaded, siteKey, theme, size, onVerify, onExpired, onError, disabled]);

  // Reset reCAPTCHA
  const reset = () => {
    if (window.grecaptcha && widgetId !== null) {
      window.grecaptcha.reset(widgetId);
    }
  };

  // Get response token
  const getResponse = (): string | null => {
    if (window.grecaptcha && widgetId !== null) {
      return window.grecaptcha.getResponse(widgetId) || null;
    }
    return null;
  };

  // Expose methods via ref
  useEffect(() => {
    if (recaptchaRef.current) {
      (recaptchaRef.current as any).reset = reset;
      (recaptchaRef.current as any).getResponse = getResponse;
    }
  }, [widgetId]);

  if (!siteKey) {
    return (
      <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 rounded-md">
        <p className="text-sm text-orange-800 dark:text-orange-200">
          reCAPTCHA設定が見つかりません。環境変数NEXT_PUBLIC_RECAPTCHA_SITE_KEYを設定してください。
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
        >
          ページを再読み込み
        </button>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={`p-4 border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-md ${className}`}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          reCAPTCHAは現在無効になっています
        </p>
      </div>
    );
  }

  return (
    <div className={`recaptcha-container ${className}`}>
      {!isLoaded && (
        <div className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              reCAPTCHAを読み込み中...
            </p>
          </div>
        </div>
      )}
      <div
        ref={recaptchaRef}
        className={isLoaded ? 'block' : 'hidden'}
        style={{ transform: 'scale(1)', transformOrigin: '0 0' }}
      />
    </div>
  );
}

// Hook for easier usage
export function useReCaptcha() {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    if (ref.current && (ref.current as any).reset) {
      (ref.current as any).reset();
    }
  };

  const getResponse = (): string | null => {
    if (ref.current && (ref.current as any).getResponse) {
      return (ref.current as any).getResponse();
    }
    return null;
  };

  return { ref, reset, getResponse };
}