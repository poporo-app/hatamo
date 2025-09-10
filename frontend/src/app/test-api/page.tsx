'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    const timestamp = Date.now();
    const testData = {
      email: `directtest${timestamp}@example.com`,
      password: 'Test1234!',
      first_name: 'Direct',
      last_name: 'Test',
      phone: '1111111111'
    };

    try {
      console.log('Sending direct request to API:', testData);
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      console.log('Direct API Response:', data);
      
      setResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2));

      if (response.ok) {
        alert(`Success! User created with email: ${testData.email}`);
      }
    } catch (error: any) {
      console.error('Direct API Error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testViaAuthAPI = async () => {
    setLoading(true);
    const timestamp = Date.now();
    
    try {
      // Dynamic import to avoid SSR issues
      const { authApi } = await import('@/lib/api/auth');
      
      const testData = {
        email: `authtest${timestamp}@example.com`,
        password: 'Test1234!',
        confirmPassword: 'Test1234!',
        firstName: 'Auth',
        lastName: 'Test'
      };

      console.log('Sending via authApi:', testData);
      const response = await authApi.register(testData);
      console.log('AuthAPI Response:', response);
      
      setResult(JSON.stringify(response, null, 2));
      alert(`Success! User created with email: ${testData.email}`);
    } catch (error: any) {
      console.error('AuthAPI Error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/database/tables/users');
      const data = await response.json();
      const lastUsers = data.rows.slice(-5).reverse();
      setResult(JSON.stringify({
        total_users: data.rows.length,
        last_5_users: lastUsers.map((u: any) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at
        }))
      }, null, 2));
    } catch (error: any) {
      setResult(`Error checking database: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testDirectAPI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg mr-4 disabled:opacity-50"
          >
            Test Direct API Call
          </button>
          
          <button
            onClick={testViaAuthAPI}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg mr-4 disabled:opacity-50"
          >
            Test via Auth API
          </button>
          
          <button
            onClick={checkDatabase}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
          >
            Check Database
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">
            {result || 'Click a button to test...'}
          </pre>
        </div>

        <div className="mt-8 bg-yellow-900/50 rounded-lg p-4">
          <p className="text-yellow-300">
            ⚠️ Open browser console (F12) to see detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}