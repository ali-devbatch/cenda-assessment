// schemas/tasks.ts
export default {
  title: 'tasks schema',
  description: 'Schema for tasks',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    task: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    // Add other properties as needed
  },
  required: ['task', 'description'],
};
