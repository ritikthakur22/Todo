import { X, RefreshCw, Trash2 } from 'lucide-react';
import { useTodos, useRestoreTodo, useHardDeleteTodo } from '../hooks/todo.hook';

function TrashModal({ isOpen, onClose }) {
  const { data, isLoading } = useTodos(1, 50, true);
  const restoreMutation = useRestoreTodo();
  const hardDeleteMutation = useHardDeleteTodo();

  if (!isOpen) return null;

  const todos = data?.data || [];

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="modal-content" style={{ background: 'var(--bg-main)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Trash Bin</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading trash...</div>
        ) : todos.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Trash is empty.</div>
        ) : (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {todos.map(todo => (
              <div key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{todo.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deleted on {new Date(todo.updatedAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => restoreMutation.mutate(todo._id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <RefreshCw size={14} /> Restore
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Permanently delete this task?')) hardDeleteMutation.mutate(todo._id); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Trash2 size={14} /> Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrashModal;
