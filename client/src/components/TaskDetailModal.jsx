import { X, Calendar, User, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

function TaskDetailModal({ isOpen, onClose, todo }) {
  if (!isOpen || !todo) return null;

  const getPriorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Low') return '#10b981';
    return '#f59e0b';
  };

  const getPriorityIcon = (p) => {
    if (p === 'High') return <ArrowUp size={16} color={getPriorityColor(p)} />;
    if (p === 'Low') return <ArrowDown size={16} color={getPriorityColor(p)} />;
    return <ArrowRight size={16} color={getPriorityColor(p)} />;
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="modal-content" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', transform: 'scale(1)', transition: 'transform 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', paddingRight: '2rem' }}>{todo.title}</h2>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}>
            {todo.category || 'Personal'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: getPriorityColor(todo.priority) }}>
            {getPriorityIcon(todo.priority)} {todo.priority}
          </span>
          {todo.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Calendar size={14} /> {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {todo.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</h4>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{todo.description}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Created By</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <User size={14} /> {todo.createdBy || 'Unknown'}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Assigned To</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <User size={14} /> {todo.assignedTo || 'Unassigned'}
            </div>
          </div>
        </div>

        {todo.subtasks && todo.subtasks.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subtasks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todo.subtasks.map((st, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--primary)', background: st.completed ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {st.completed && <X size={12} color="white" style={{ transform: 'rotate(45deg)' }} />}
                  </div>
                  <span style={{ textDecoration: st.completed ? 'line-through' : 'none', opacity: st.completed ? 0.5 : 1 }}>{st.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {todo.attachmentUrl && (
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Attachment</h4>
            <img src={todo.attachmentUrl} alt="Attachment" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetailModal;
