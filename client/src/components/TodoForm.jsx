
import { useState, useRef } from 'react';
import { Plus, Flag, Calendar,User, X , Image as ImageIcon} from 'lucide-react';
import { uploadImage } from '../api/todoapi';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
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

    
  const toggleAssignee = (name) => {
    if (assignedTo.includes(name)) {
      setAssignedTo(assignedTo.filter(n => n !== name));
    } else {
      setAssignedTo([...assignedTo, name]);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
    setNewSubtask('');
  };
  
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

    const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e);
    }
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

    onAdd({ title, description, priority, category: 'Personal', dueDate, createdBy, assignedTo: assignedTo.join(', '), attachmentUrl, subtasks });
    setTitle(''); setDescription(''); setAttachment(null); setSubtasks([]); setCreatedBy(''); setAssignedTo([]);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="add-task-container">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-top">
          <input type="text" placeholder="Task title (e.g. Study React)" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={handleKeyDown} required />
          <button type="submit" className="btn-add" disabled={isUploading} title="Shortcut: Ctrl+Enter">
            {isUploading ? 'Uploading...' : <><Plus size={16} /> Add Task</>}
          </button>
        </div>
        <textarea placeholder="Add a description (optional)..." value={description} onChange={(e) => setDescription(e.target.value)} onKeyDown={handleKeyDown}></textarea>
        

        
        <div className="form-options">
          <div className="option-group">
            <label><User size={14} /> Created By</label>
            <select value={createdBy} onChange={e => setCreatedBy(e.target.value)} required>
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
            <label><User size={14} /> Assign To</label>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
              {['Aadaarsh', 'Amit', 'Ritik', 'Sujal', 'Sumit', 'Sushil'].map(name => (
                <span 
                  key={name}
                  onClick={() => toggleAssignee(name)}
                  style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer',
                    background: assignedTo.includes(name) ? 'var(--primary)' : 'transparent',
                    border: '1px solid ' + (assignedTo.includes(name) ? 'var(--primary)' : 'var(--border-color)'),
                    color: assignedTo.includes(name) ? 'white' : 'var(--text-main)'
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
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
