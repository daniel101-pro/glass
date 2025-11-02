import { useState, useEffect, type JSX } from "react";
import { Button } from "../components/ui/button";
import { Download, Trash2, ArrowLeft, RefreshCw } from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: string;
}

export const AdminPage = (): JSX.Element => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    // Check if already authenticated (simple localStorage check)
    const savedAuth = localStorage.getItem('waitlist_admin_auth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
      fetchEntries();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Login using the auth endpoint
      // For admin access, you'll need to create an admin account first
      const loginEmail = email || import.meta.env.VITE_ADMIN_EMAIL || 'admin@glass.app';
      
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store token
      if (data.data?.tokens?.accessToken) {
        localStorage.setItem('auth_token', data.data.tokens.accessToken);
        setIsAuthenticated(true);
        localStorage.setItem('waitlist_admin_auth', 'authenticated');
        fetchEntries();
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/api/v1/waitlist`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('waitlist_admin_auth');
          throw new Error('Authentication required. Please login.');
        }
        throw new Error('Failed to fetch waitlist');
      }
      
      const data = await response.json();
      setEntries(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load waitlist');
      console.error('Error fetching waitlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/api/v1/waitlist/${id}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('waitlist_admin_auth');
          throw new Error('Authentication required');
        }
        throw new Error('Failed to delete entry');
      }

      // Refresh the list
      fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/api/v1/waitlist/export`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('waitlist_admin_auth');
          throw new Error('Authentication required');
        }
        throw new Error('Failed to export');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export waitlist');
      console.error('Export error:', err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('waitlist_admin_auth');
    localStorage.removeItem('auth_token');
    setEmail("");
    setPassword("");
    setEntries([]);
  };

  if (!isAuthenticated) {
    return (
      <section className="relative w-full min-h-screen bg-[#85b5d9] overflow-hidden flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] bg-[#749fbf99] backdrop-blur-xl rounded-[34px] border border-white/20 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
          <h1 className="font-['Instrument_Sans'] font-semibold text-3xl text-[#eef9fd] mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-['Instrument_Sans'] font-medium text-[#c0ddef]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[#c0ddef] text-[#F3F4F9] font-['Instrument_Sans'] focus:outline-none focus:ring-2 focus:ring-[#c0ddef]"
                placeholder="admin@glass.app"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-['Instrument_Sans'] font-medium text-[#c0ddef]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[#c0ddef] text-[#F3F4F9] font-['Instrument_Sans'] focus:outline-none focus:ring-2 focus:ring-[#c0ddef]"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-red-300 text-sm">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full h-[44px] bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] font-['Instrument_Sans'] font-medium hover:bg-[rgba(255,255,255,0.15)]"
            >
              Login
            </Button>
          </form>
          <Button
            onClick={() => { window.location.hash = '#hero'; }}
            variant="ghost"
            className="mt-4 w-full text-[#c0ddef] hover:text-[#eef9fd]"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-[#85b5d9] overflow-hidden px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-['Instrument_Sans'] font-semibold text-3xl sm:text-4xl text-[#eef9fd] mb-2">
              Waitlist Admin
            </h1>
            <p className="font-['Instrument_Sans'] text-[#c0ddef]">
              {entries.length} {entries.length === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchEntries}
              className="bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] hover:bg-[rgba(255,255,255,0.15)]"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleExport}
              className="bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] hover:bg-[rgba(255,255,255,0.15)]"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-[#c0ddef] hover:text-[#eef9fd]"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw size={32} className="text-[#eef9fd] animate-spin" />
          </div>
        ) : (
          /* Waitlist entries table */
          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[34px] border border-white/20 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            {entries.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-['Instrument_Sans'] text-[#c0ddef] text-lg">
                  No waitlist entries yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[rgba(255,255,255,0.05)]">
                    <tr>
                      <th className="px-6 py-4 text-left font-['Instrument_Sans'] font-semibold text-[#eef9fd]">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-['Instrument_Sans'] font-semibold text-[#eef9fd]">
                        Date Joined
                      </th>
                      <th className="px-6 py-4 text-right font-['Instrument_Sans'] font-semibold text-[#eef9fd]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={`border-t border-white/10 ${
                          index % 2 === 0 ? 'bg-[rgba(255,255,255,0.02)]' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-['Instrument_Sans'] text-[#eef9fd]">
                          {entry.email}
                        </td>
                        <td className="px-6 py-4 font-['Instrument_Sans'] text-[#c0ddef]">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleDelete(entry.id)}
                            variant="ghost"
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};


