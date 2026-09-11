
import { useState } from 'react';
import { Plus, Flag, Calendar, Tag } from 'lucide-react';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority, category, dueDate });
    setTitle(''); setDescription('');
  };

  return (
    <div className="add-task-container">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-top">
          <input type="text" placeholder="Task title (e.g. Study React)" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <button type="submit" className="btn-add"><Plus size={16} /> Add Task</button>
        </div>
        <textarea placeholder="Add a description (optional)..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        
        <div className="form-options">
          <div className="option-group">
            <label><Flag size={14} /> Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="option-group">
            <label><Calendar size={14} /> Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="option-group">
            <label><Tag size={14} /> Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
export default TodoForm;
