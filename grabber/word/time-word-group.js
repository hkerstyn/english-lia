import {WordGroup}
  from './word-group.js';

export class TimeWordGroup extends WordGroup {
  constructor() {
    super();
    this.start = undefined;
    this.duration = undefined;
  }
}
