
import { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const getPriorityIcon = (p) => {
    if (p === 'High') return <ArrowUp size={12} color="#ef4444" />;
    if (p === 'Medium') return <ArrowRight size={12} color="#f59e0b" />;
    return <ArrowDown size={12} color="#10b981" />;
  };

  return (
    <div className={`task-row ${todo.completed ? 'completed' : ''}`}>
      <div className="task-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo._id)} />
      </div>
      
      <div className="task-content">
        {isEditing ? (
          <input className="edit-input" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={() => { onEdit(todo._id, { title: editText }); setIsEditing(false); }} autoFocus />
        ) : (
          <div className="task-title">{todo.title}</div>
        )}
        {todo.description && <div className="task-desc">{todo.description}</div>}
        <div className="task-badges">
          {todo.tags && todo.tags.map(t => <span key={t} className="tag-badge">#{t}</span>)}
        </div>
      </div>

      <div className="task-meta">
        <span className={`badge priority-${todo.priority?.toLowerCase()}`}>
          {getPriorityIcon(todo.priority)} {todo.priority}
        </span>
        {todo.dueDate && (
          <span className="badge date">
            <Calendar size={12} /> {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
        <span className="badge category">
          <Tag size={12} /> {todo.category}
        </span>
      </div>

      <div className="task-actions">
        <button className="btn-icon" onClick={() => setIsEditing(!isEditing)}><Edit2 size={16} /></button>
        <button className="btn-icon delete" onClick={() => onDelete(todo._id)}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
export default TodoItem;
