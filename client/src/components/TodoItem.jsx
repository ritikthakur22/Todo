
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Trash2, Calendar,ArrowUp, ArrowRight, ArrowDown, Save, X, GripVertical, Plus, User, Image as ImageIcon} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { uploadImage } from '../api/todoapi';

function TodoItem({ todo, onToggle, onDelete, onEdit, onClickTodo }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority || 'Medium',
    category: todo.category || 'Personal',
    createdBy: todo.createdBy || '',
    assignedTo: todo.assignedTo || '',
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    subtasks: todo.subtasks || [],
    attachmentUrl: todo.attachmentUrl || ''
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const getPriorityIcon = (p) => {
    if (p === 'High') return <ArrowUp size={12} color="#ef4444" />;
    if (p === 'Medium') return <ArrowRight size={12} color="#f59e0b" />;
    return <ArrowDown size={12} color="#10b981" />;
  };

  
  const handleEditAssignChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setEditData({...editData, assignedTo: options.join(', ')});
  };

  const handleSave = async () => {
    if (!editData.title.trim()) return;
    setIsUploading(true);
    let finalUrl = editData.attachmentUrl;
    if (newFile) {
      try {
        const res = await uploadImage(newFile);
        finalUrl = res.url;
      } catch (err) { console.error("Upload failed", err); }
    }
    const finalData = { ...editData, attachmentUrl: finalUrl };
    onEdit(todo._id, finalData);
    setEditData(finalData);
    setIsUploading(false);
    setIsEditing(false);
  };

  const toggleSubtask = (index) => {
    const newSubtasks = [...editData.subtasks];
    newSubtasks[index].completed = !newSubtasks[index].completed;
    setEditData({ ...editData, subtasks: newSubtasks });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setEditData({ ...editData, subtasks: [...editData.subtasks, { title: newSubtask, completed: false }] });
    setNewSubtask('');
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="task-row editing-mode">
        <div className="edit-form-full">
          <input className="edit-input-title" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} autoFocus />
          <textarea className="edit-input-desc" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} placeholder="Add a description..." />
          
          <div className="edit-options-row">
            <div className="option-group">
              <label>Created By</label>
              <select value={editData.createdBy} onChange={e => setEditData({...editData, createdBy: e.target.value})}>
                <option value="" disabled>Select user...</option>
                <option value="Aadaarsh">Aadaarsh</option>
                <option value="Amit">Amit</option>
                <option value="Ritik">Ritik</option>
                <option value="Sujal">Sujal</option>
                <option value="Sumit">Sumit</option>
                <option value="Sushil">Sushil</option>
              </select>
            </div>
            <div className="option-group">
              <label>Assign To</label>
              <select multiple value={editData.assignedTo.split(', ')} onChange={handleEditAssignChange} style={{ height: '80px' }}>
                <option value="" disabled>Select user(s)...</option>
                <option value="Aadaarsh">Aadaarsh</option>
                <option value="Amit">Amit</option>
                <option value="Ritik">Ritik</option>
                <option value="Sujal">Sujal</option>
                <option value="Sumit">Sumit</option>
                <option value="Sushil">Sushil</option>
              </select>
            </div>
            <div className="option-group">
              <label>Priority</label>
              <select value={editData.priority} onChange={(e) => setEditData({...editData, priority: e.target.value})}>
                <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
            <div className="option-group">
              <label>Due Date</label>
              <input type="date" value={editData.dueDate} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} />
            </div>
            <div className="option-group">
              <label>Image Update</label>
              <input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files[0])} style={{fontSize: '0.8rem', width: '150px'}} />
            </div>
          </div>
          
          

          <div className="edit-actions-row">
            <button className="btn-add" onClick={handleSave} disabled={isUploading}>{isUploading ? 'Saving...' : <><Save size={16} /> Save Changes</>}</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={`task-row ${todo.completed ? 'completed' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} color="var(--text-muted)" />
      </div>
      <div className="task-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo._id)} />
      </div>
      
      <div className="task-content" onClick={() => onClickTodo(todo)} style={{ cursor: "pointer", flex: 1 }}>
        <div className="task-title">{todo.title}</div>
        {todo.description && <div className="task-desc">{todo.description}</div>}
        {todo.attachmentUrl && (
          <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}>
            <img 
              src={todo.attachmentUrl} 
              alt="attachment" 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
              style={{ maxWidth: '100px', borderRadius: '4px', border: '1px solid var(--border-color)', cursor: 'zoom-in' }} 
            />
          </div>
        )}
        
        {isZoomed && createPortal(
          <div 
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={todo.attachmentUrl} 
              style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '8px', cursor: 'zoom-out', opacity: 1 }} 
              onClick={(e) => e.stopPropagation()}
            />
            <a 
              href={todo.attachmentUrl.replace('/upload/', '/upload/fl_attachment/')} 
              download 
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Download Image
            </a>
          </div>,
          document.body
        )}
        
      </div>

      <div className="task-meta">
        <span className="badge" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          Created: {new Date(todo.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
        </span>
        <span className="badge category">
          <User size={12} /> {todo.createdBy || 'Ritik'} → {todo.assignedTo || 'Myself'}
        </span>
        <span className={`badge priority-${todo.priority?.toLowerCase()}`}>
          {getPriorityIcon(todo.priority)} {todo.priority}
        </span>
        {todo.dueDate && (
          <span className="badge date">
            <Calendar size={12} /> Due: {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-icon" onClick={() => setIsEditing(true)}><Edit2 size={16} /></button>
        <button className="btn-icon delete" onClick={() => onDelete(todo._id)}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
export default TodoItem;
