import { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, ArrowUp, ArrowRight, ArrowDown, Save, X } from 'lucide-react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Keep all fields in a single state object for the edit form
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority || 'Medium',
    category: todo.category || 'Personal',
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
  });

  const getPriorityIcon = (p) => {
    if (p === 'High') return <ArrowUp size={12} color="#ef4444" />;
    if (p === 'Medium') return <ArrowRight size={12} color="#f59e0b" />;
    return <ArrowDown size={12} color="#10b981" />;
  };

  const handleSave = () => {
    if (!editData.title.trim()) return;
    onEdit(todo._id, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-row editing-mode">
        <div className="edit-form-full">
          <input 
            className="edit-input-title" 
            value={editData.title} 
            onChange={(e) => setEditData({...editData, title: e.target.value})} 
            autoFocus 
          />
          <textarea 
            className="edit-input-desc" 
            value={editData.description} 
            onChange={(e) => setEditData({...editData, description: e.target.value})} 
            placeholder="Add a description..."
          />
          <div className="edit-options-row">
            <div className="option-group">
              <label>Priority</label>
              <select value={editData.priority} onChange={(e) => setEditData({...editData, priority: e.target.value})}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="option-group">
              <label>Due Date</label>
              <input type="date" value={editData.dueDate} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} />
            </div>
            <div className="option-group">
              <label>Category</label>
              <select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})}>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
          <div className="edit-actions-row">
            <button className="btn-add" onClick={handleSave}><Save size={16} /> Save Changes</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-row ${todo.completed ? 'completed' : ''}`}>
      <div className="task-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo._id)} />
      </div>
      
      <div className="task-content">
        <div className="task-title">{todo.title}</div>
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
        <button className="btn-icon" onClick={() => setIsEditing(true)}><Edit2 size={16} /></button>
        <button className="btn-icon delete" onClick={() => onDelete(todo._id)}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
export default TodoItem;
