// TodoFilter.jsx — Shows three buttons: All, Pending, Completed
//
// It does NOT filter the todos itself.
// It simply tells the parent (App) which filter the user selected.
// App will do the actual filtering — because App owns the data.
//
// Props received:
//   currentFilter → which filter is currently active ('all'/'pending'/'completed')
//   onFilterChange → function to call when user picks a different filter

function TodoFilter({ currentFilter, onFilterChange }) {
  // The three filter options
  const filters = ['all', 'pending', 'completed'];

  return (
    <div className="todo-filter">
      {filters.map((filter) => (
        <button
          key={filter}
          // Add 'active' class to the currently selected filter button
          className={`btn btn-filter ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {/* Capitalize first letter for display: 'all' → 'All' */}
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default TodoFilter;
