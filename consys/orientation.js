//the name dictionary maps together the
//* name
//* direction and factor
//of an Orientation
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

// an orientation holds the following properties:
// * direction {'row'|'column'}
// * factor {'pos'|'neg'}
export class Orientation {

  //creates a new Orientation by direction and factor
  constructor(direction, factor) {
    this.direction = direction;
    this.factor = factor;
  }

  //creates a new Orientation by name {'up'|'left'|'down'|'right'}
  static ofName(name) {
    //searches the name dictionary
    let correctEntry = NAME_DICT
      .find(entry => (entry.name == name))
      .orientation;

    //creates a matching Orientation
    return new Orientation(correctEntry.direction, correctEntry.factor);
  }

  //returns the matching name of an Orientation
  get name() {
    //search the name dictionary for a matching Orientation and return its name
    return NAME_DICT
      .find(entry => (
        (entry.orientation.direction == this.direction)&&
      (entry.orientation.factor == this.factor)))
      .name;
  }
}
