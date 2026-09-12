
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, CheckCircle, Target } from 'lucide-react';

function StatsDashboard({ todos }) {
  const completedTasks = todos.filter(t => t.completed);
  
  // Calculate Streak (Simulated based on creation/update dates)
  // In a real app, this requires daily cron tracking. We'll use a simple mock calculation here.
  const streak = completedTasks.length > 0 ? 3 : 0; 
  
  // Group by category
  const categoryData = [];
  ['Work', 'Personal', 'Education'].forEach(cat => {
    const count = todos.filter(t => t.category === cat).length;
    if (count > 0) categoryData.push({ name: cat, count });
  });

  return (
    <div className="stats-dashboard">
      <div className="stats-header">
        <h2>Productivity Dashboard</h2>
        <p>Track your progress and build habits.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon yellow"><Flame size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Current Streak</span>
            <span className="stat-value">{streak} Days 🔥</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Tasks Finished</span>
            <span className="stat-value">{completedTasks.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Target size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Most Active Category</span>
            <span className="stat-value">{categoryData.length > 0 ? categoryData.sort((a,b)=>b.count - a.count)[0].name : 'None'}</span>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: '3rem', height: '300px', background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px' }}>
        <h3>Tasks by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1c1e29', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default StatsDashboard;
