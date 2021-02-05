const { EntitySchema } = require('typeorm');

class Task {
  constructor(id, job, done, desc, filename, addedAt) {
    this.id = id;
    this.job = job;
    this.desc = desc;
    this.done = done;
    this.filename = filename;
    this.addedAt = addedAt;
  }
}

const TaskSchema = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  target: Task,
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    job: {
      type: 'text',
    },
    desc: {
      type: 'text',
    },
    done: {
      type: 'boolean',
      default: false,
    },
    filename: {
      type: 'text',
    },
    addedAt: {
      type: 'timestamp',
      name: 'added_at',
      nullable: false,
      default: () => 'NOW()',
    },
  },
  // relations: {
  //   assignee: {
  //     target: 'Worker',
  //     type: 'many-to-one',
  //     onDelete: 'CASCADE',
  //   },
  // },
});

module.exports = {
  Task,
  TaskSchema,
};
