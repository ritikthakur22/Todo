
import { useState, useRef } from 'react';
import { Plus, Flag, Calendar, Tag, Image as ImageIcon, User } from 'lucide-react';
import todoService from '../services/todoService';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [createdBy, setCreatedBy] = useState('Ritik');
  const [assignedTo, setAssignedTo] = useState('Myself');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let attachmentUrl = '';
    if (attachment) {
      setIsUploading(true);
      try {
        const res = await todoService.uploadImage(attachment);
        attachmentUrl = res.url;
      } catch (err) {
        console.error("Upload failed", err);
      }
      setIsUploading(false);
    }

    onAdd({ title, description, priority, category, dueDate, createdBy, assignedTo, attachmentUrl });
    setTitle(''); setDescription(''); setAttachment(null);
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
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
