import re

# 1. Update Todo.js schema
with open("server/models/Todo.js", "r") as f:
    model_js = f.read()

schema_addition = """
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date, default: null },
    category: { type: String, default: 'Personal' },
    tags: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
"""

model_js = re.sub(r'title: \{.*?\},\s*completed: \{.*?\},', schema_addition, model_js, flags=re.DOTALL)

with open("server/models/Todo.js", "w") as f:
    f.write(model_js)


# 2. Update todoController.js
with open("server/controllers/todoController.js", "r") as f:
    ctrl_js = f.read()

ctrl_js = ctrl_js.replace(
    "const { title } = req.body;",
    "const { title, description, priority, dueDate, category, tags } = req.body;"
)
ctrl_js = ctrl_js.replace(
    "const newTodo = await Todo.create({ title });",
    "const newTodo = await Todo.create({ title, description, priority, dueDate, category, tags });"
)
ctrl_js = ctrl_js.replace(
    "const { title, completed } = req.body;",
    "const { title, completed, description, priority, dueDate, category, tags } = req.body;"
)
ctrl_js = ctrl_js.replace(
    "if (title !== undefined) updates.title = title.trim();\n    if (completed !== undefined) updates.completed = completed;",
    "if (title !== undefined) updates.title = title.trim();\n    if (completed !== undefined) updates.completed = completed;\n    if (description !== undefined) updates.description = description;\n    if (priority !== undefined) updates.priority = priority;\n    if (dueDate !== undefined) updates.dueDate = dueDate;\n    if (category !== undefined) updates.category = category;\n    if (tags !== undefined) updates.tags = tags;"
)

with open("server/controllers/todoController.js", "w") as f:
    f.write(ctrl_js)

print("Backend updated")
