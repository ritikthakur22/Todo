
import TodoItem from './TodoItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Add one above! ☝️</p>
      </div>
    );
  }

  return (
    <SortableContext items={todos.map(t => t._id)} strategy={verticalListSortingStrategy}>
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </SortableContext>
  );
}
export default TodoList;
