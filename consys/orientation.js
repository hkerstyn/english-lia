const NAME_DICT = [
  {
    name: 'up',
    orientation: {direction: 'column', factor: 'neg'}
  },
  {
    name: 'down',
    orientation: {direction: 'column', factor: 'pos'}
  },
  {
    name: 'left',
    orientation: {direction: 'row', factor: 'neg'}
  },
  {
    name: 'right',
    orientation: {direction: 'row', factor: 'pos'}
  }
];

export class Orientation {
  constructor(direction, factor) {
    this.direction = direction;
    this.factor = factor;
  }
  static ofName(name) {
    let correctEntry = NAME_DICT
      .find(entry => (entry.name == name))
      .orientation;
    return new Orientation(correctEntry.direction, correctEntry.factor);
  }
  get name() {
    return NAME_DICT
      .find(entry => (
        (entry.orientation.direction == this.direction)&&
      (entry.orientation.factor == this.factor)))
      .name;
  }
}
