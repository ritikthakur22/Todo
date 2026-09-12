
import { useState, useRef } from 'react';
import { Plus, Flag, Calendar,User, X , Image as ImageIcon} from 'lucide-react';
import { uploadImage } from '../api/todoapi';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [createdBy, setCreatedBy] = useState('Ritik');
  const [assignedTo, setAssignedTo] = useState('Myself');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const fileInputRef = useRef(null);

    const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
    setNewSubtask('');
  };
  
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let attachmentUrl = '';
    if (attachment) {
      setIsUploading(true);
      try {
        const res = await uploadImage(attachment);
        attachmentUrl = res.url;
      } catch (err) {
        console.error("Upload failed", err);
      }
      setIsUploading(false);
    }

    onAdd({ title, description, priority, category, dueDate, createdBy, assignedTo, attachmentUrl, subtasks });
    setTitle(''); setDescription(''); setAttachment(null); setSubtasks([]);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="add-task-container">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-top">
          <input type="text" placeholder="Task title (e.g. Study React)" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <button type="submit" className="btn-add" disabled={isUploading}>
            {isUploading ? 'Uploading...' : <><Plus size={16} /> Add Task</>}
          </button>
        </div>
        <textarea placeholder="Add a description (optional)..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <div className="subtasks-section" style={{ marginTop: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subtasks</h4>
          {subtasks.map((st, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span>• {st.title}</span>
              <button type="button" onClick={() => removeSubtask(i)} style={{ background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer' }}><X size={14}/></button>
            </div>
          ))}
          <div className="add-subtask-row" style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newSubtask} 
              onChange={e => setNewSubtask(e.target.value)} 
              placeholder="Add a subtask..." 
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } }}
              style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white' }}
            />
            <button type="button" onClick={addSubtask} style={{ padding: '0 0.8rem', borderRadius: '4px', background: 'var(--border-color)', color: 'white', border: 'none', cursor: 'pointer' }}>Add</button>
          </div>
        </div>

        
        <div className="form-options">
          <div className="option-group">
            <label><User size={14} /> Created By</label>
            <input type="text" value={createdBy} onChange={e => setCreatedBy(e.target.value)} placeholder="e.g. Ritik" />
          </div>
          <div className="option-group">
            <label><User size={14} /> Assign To</label>
            <input type="text" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="e.g. Rahul" />
          </div>
          <div className="option-group">
            <label><Flag size={14} /> Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
            </select>
          </div>
          <div className="option-group">
            <label><Calendar size={14} /> Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="option-group">
            <label><ImageIcon size={14} /> Image</label>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => setAttachment(e.target.files[0])} style={{fontSize: '0.8rem', width: '150px'}} />
          </div>
        </div>
      </form>
    </div>
  );
}
export default TodoForm;
