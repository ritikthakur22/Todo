import re

with open("server/controllers/todoController.js", "r") as f:
    ctrl = f.read()

# Replace res.status(201).json(todo) in createTodo
ctrl = re.sub(
    r"res\.status\(201\)\.json\((.*?)\);",
    r"req.app.get('io').emit('todo_added', \1);\n    res.status(201).json(\1);",
    ctrl
)

# Replace res.json(updatedTodo) in updateTodo
ctrl = re.sub(
    r"res\.json\((.*?)\);",
    r"req.app.get('io').emit('todo_updated', \1);\n    res.json(\1);",
    ctrl,
    count=1 # only in updateTodo (well, wait, what about getTodos?)
)
# Ah wait, getTodos uses res.json({ data, pagination, stats })
# We can be more precise.
