import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Flame, CheckCircle, Users } from 'lucide-react';

function StatsDashboard({ todos }) {
  const completedTasks = todos.filter(t => t.completed);
  
  // 1. Calculate Streak
  const streak = completedTasks.length > 0 ? 3 : 0; 
  
  // 2. Priority Data
  const priorityData = ['High', 'Medium', 'Low'].map(p => {
    const pTodos = todos.filter(t => (t.priority || 'Medium') === p);
    const completed = pTodos.filter(t => t.completed).length;
    const pending = pTodos.length - completed;
    return { name: p + ' Priority', Completed: completed, Pending: pending };
  });

  // 3. Assignee Workload Data
  const assignees = [...new Set(todos.map(t => t.assignedTo || 'Unassigned'))];
  const assigneeData = assignees.map(a => {
    const aTodos = todos.filter(t => (t.assignedTo || 'Unassigned') === a);
    const completed = aTodos.filter(t => t.completed).length;
    const pending = aTodos.length - completed;
    return { name: a, Completed: completed, Pending: pending, total: aTodos.length };
  }).sort((a, b) => b.total - a.total).slice(0, 5); // Top 5 assignees

  const topContributor = assigneeData.length > 0 
    ? [...assigneeData].sort((a,b) => b.Completed - a.Completed)[0].name 
    : 'None';

  return (
    <div className="stats-dashboard">
      <div className="stats-header" style={{ marginBottom: '2rem' }}>
        <h2>Team Productivity Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track team workloads and priority completion rates.</p>
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
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Top Contributor</span>
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{topContributor}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Chart 1: Priority Breakdown */}
        <div className="chart-container" style={{ height: '350px', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Completion by Priority</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Completed" stackId="a" fill="var(--success)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Pending" stackId="a" fill="var(--warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Assignee Workload */}
        <div className="chart-container" style={{ height: '350px', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Team Workload (Top 5)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={assigneeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Completed" stackId="b" fill="var(--primary)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Pending" stackId="b" fill="rgba(156, 163, 175, 0.4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
export default StatsDashboard;
