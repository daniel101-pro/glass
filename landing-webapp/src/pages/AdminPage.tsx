import { useState, useEffect, useMemo, type JSX } from "react";
import { Button } from "../components/ui/button";
import { Download, Trash2, ArrowLeft, RefreshCw, Users, TrendingUp, Mail, Calendar, BarChart3, Globe } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface AnalyticsData {
  date: string;
  visits: number;
  pageViews: number;
  signups: number;
}

export const AdminPage = (): JSX.Element => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const API_URL = import.meta.env.VITE_API_URL || 'https://glass-qpbx.onrender.com';

  useEffect(() => {
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

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSignups = entries.length;
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const signupsLast7Days = entries.filter(entry => {
      const date = new Date(entry.createdAt);
      return date >= sevenDaysAgo;
    }).length;
    
    const signupsLast30Days = entries.filter(entry => {
      const date = new Date(entry.createdAt);
      return date >= thirtyDaysAgo;
    }).length;
    
    const growthRate = signupsLast30Days > 0 
      ? ((signupsLast7Days - (signupsLast30Days - signupsLast7Days) / 3) / (signupsLast30Days - signupsLast7Days) * 100).toFixed(1)
      : '0';

    return {
      totalSignups,
      signupsLast7Days,
      signupsLast30Days,
      growthRate,
    };
  }, [entries]);

  // Generate waitlist growth chart data
  const waitlistChartData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data: AnalyticsData[] = [];
    const today = new Date();
    
    // Group entries by date
    const entriesByDate = new Map<string, number>();
    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      entriesByDate.set(dateKey, (entriesByDate.get(dateKey) || 0) + 1);
    });
    
    // Generate cumulative data
    let cumulative = 0;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const signups = entriesByDate.get(dateKey) || 0;
      cumulative += signups;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visits: Math.floor(Math.random() * 200) + 50, // Mock data - replace with real GA data
        pageViews: Math.floor(Math.random() * 400) + 100, // Mock data
        signups: cumulative,
      });
    }
    
    return data;
  }, [entries, timeRange]);

  // Generate daily signups chart
  const dailySignupsData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data: { date: string; signups: number }[] = [];
    const today = new Date();
    
    const entriesByDate = new Map<string, number>();
    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      entriesByDate.set(dateKey, (entriesByDate.get(dateKey) || 0) + 1);
    });
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const signups = entriesByDate.get(dateKey) || 0;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        signups,
      });
    }
    
    return data;
  }, [entries, timeRange]);

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-['Instrument_Sans'] font-semibold text-3xl sm:text-4xl text-[#eef9fd] mb-2">
              Dashboard
            </h1>
            <p className="font-['Instrument_Sans'] text-[#c0ddef]">
              Analytics & Waitlist Management
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
              className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[20px] border border-[#c0ddef] font-['Instrument_Sans'] focus:outline-none focus:ring-2 focus:ring-[#c0ddef]"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(133,181,217,0.2)] flex items-center justify-center">
                <Users className="text-[#eef9fd]" size={24} />
              </div>
              <span className="text-[#c0ddef] text-sm font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-[#eef9fd] mb-1">{stats.totalSignups}</h3>
            <p className="text-[#c0ddef] text-sm">Waitlist Signups</p>
          </div>

          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(133,181,217,0.2)] flex items-center justify-center">
                <TrendingUp className="text-[#eef9fd]" size={24} />
              </div>
              <span className="text-[#c0ddef] text-sm font-medium">7 Days</span>
            </div>
            <h3 className="text-3xl font-bold text-[#eef9fd] mb-1">{stats.signupsLast7Days}</h3>
            <p className="text-[#c0ddef] text-sm">New Signups</p>
          </div>

          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(133,181,217,0.2)] flex items-center justify-center">
                <Globe className="text-[#eef9fd]" size={24} />
              </div>
              <span className="text-[#c0ddef] text-sm font-medium">Est.</span>
            </div>
            <h3 className="text-3xl font-bold text-[#eef9fd] mb-1">
              {waitlistChartData.reduce((sum, d) => sum + d.visits, 0).toLocaleString()}
            </h3>
            <p className="text-[#c0ddef] text-sm">Website Visits</p>
          </div>

          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(133,181,217,0.2)] flex items-center justify-center">
                <BarChart3 className="text-[#eef9fd]" size={24} />
              </div>
              <span className="text-[#c0ddef] text-sm font-medium">Rate</span>
            </div>
            <h3 className="text-3xl font-bold text-[#eef9fd] mb-1">
              {stats.totalSignups > 0 
                ? ((stats.totalSignups / waitlistChartData.reduce((sum, d) => sum + d.visits, 0)) * 100).toFixed(1) 
                : '0'}%
            </h3>
            <p className="text-[#c0ddef] text-sm">Conversion Rate</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Website Visits Chart */}
          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-['Instrument_Sans'] font-semibold text-xl text-[#eef9fd] mb-1">
                  Website Visits
                </h3>
                <p className="font-['Instrument_Sans'] text-sm text-[#c0ddef]">Daily traffic overview</p>
              </div>
              <Globe className="text-[#c0ddef]" size={24} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={waitlistChartData}>
                <defs>
                  <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#85b5d9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#85b5d9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c0ddef" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  stroke="#c0ddef" 
                  fontSize={12}
                  tick={{ fill: '#c0ddef' }}
                />
                <YAxis 
                  stroke="#c0ddef" 
                  fontSize={12}
                  tick={{ fill: '#c0ddef' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#749fbf', 
                    border: '1px solid #c0ddef',
                    borderRadius: '12px',
                    color: '#eef9fd'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#85b5d9" 
                  strokeWidth={2}
                  fill="url(#visitsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Signups Chart */}
          <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-['Instrument_Sans'] font-semibold text-xl text-[#eef9fd] mb-1">
                  Daily Signups
                </h3>
                <p className="font-['Instrument_Sans'] text-sm text-[#c0ddef]">Waitlist growth</p>
              </div>
              <Mail className="text-[#c0ddef]" size={24} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailySignupsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c0ddef" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  stroke="#c0ddef" 
                  fontSize={12}
                  tick={{ fill: '#c0ddef' }}
                />
                <YAxis 
                  stroke="#c0ddef" 
                  fontSize={12}
                  tick={{ fill: '#c0ddef' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#749fbf', 
                    border: '1px solid #c0ddef',
                    borderRadius: '12px',
                    color: '#eef9fd'
                  }}
                />
                <Bar dataKey="signups" fill="#85b5d9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Combined Analytics Chart */}
        <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 p-6 mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-['Instrument_Sans'] font-semibold text-xl text-[#eef9fd] mb-1">
                Analytics Overview
              </h3>
              <p className="font-['Instrument_Sans'] text-sm text-[#c0ddef]">Visits, page views, and signups</p>
            </div>
            <BarChart3 className="text-[#c0ddef]" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waitlistChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c0ddef" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                stroke="#c0ddef" 
                fontSize={12}
                tick={{ fill: '#c0ddef' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#c0ddef" 
                fontSize={12}
                tick={{ fill: '#c0ddef' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#c0ddef" 
                fontSize={12}
                tick={{ fill: '#c0ddef' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#749fbf', 
                  border: '1px solid #c0ddef',
                  borderRadius: '12px',
                  color: '#eef9fd'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#c0ddef' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="visits" 
                stroke="#85b5d9" 
                strokeWidth={2}
                name="Visits"
                dot={{ fill: '#85b5d9', r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="pageViews" 
                stroke="#eef9fd" 
                strokeWidth={2}
                name="Page Views"
                dot={{ fill: '#eef9fd', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="signups" 
                stroke="#c0ddef" 
                strokeWidth={2}
                name="Total Signups"
                dot={{ fill: '#c0ddef', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Waitlist Table */}
        <div className="bg-[#749fbf99] backdrop-blur-xl rounded-[24px] border border-white/20 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.40)]">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Instrument_Sans'] font-semibold text-xl text-[#eef9fd] mb-1">
                  Waitlist Entries
                </h3>
                <p className="font-['Instrument_Sans'] text-sm text-[#c0ddef]">
                  {entries.length} {entries.length === 1 ? 'submission' : 'submissions'}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={32} className="text-[#eef9fd] animate-spin" />
            </div>
          ) : entries.length === 0 ? (
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
                        {new Date(entry.createdAt).toLocaleString()}
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
      </div>
    </section>
  );
};
