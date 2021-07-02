export class Lul {


  constructor() {
    this.BOX_CLASS = 'lul-padding lul-light';

    this.HOVER_COLLAPSE_DELAY = '0.45s';
    this.HOVER_INITIAL_DELAY_MS = 80;
    this.COLLAPSIBLE_CLASS_MAP = {
      width: 'lul-collapsible-width',
      height: 'lul-collapsible-height'
    };
  
    this.DEFAULT_OVERFLOW_CLASS = 'lul-overflow';
    this.DEFAULT_OVERFLOW_PARENT_CLASS = 'lul-overflow-parent lul-margin';
    this.DEFAULT_BUTTON_CLASS = 'lul-dark lul-medium-hover lul-norm-height';

    this.INPUT_ELEMENTS = {
      radio: {
        className: 'lia-radio',
        minWidth: 0,
        inputType: 'radio'
      },
      check: {
        className: 'lia-checkbox',
        minWidth: 0,
        inputType: 'checkbox'
      },
      range: {
        className: 'lia-range',
        minWidth: 225,
        inputType: 'range'
      },
      enter: {
        className: 'lia-input',
        minWidth: 225,
        inputType: 'text'
      }
    }; 
 
    this.SELECTED_BUTTON_RADIO_CLASSNAME = 'lul-dark';
    this.UNSELECTED_BUTTON_RADIO_CLASSNAME = 'lul-light lul-medium-hover';
    this.MAX_SELECTION_WIDTH = 500;

    



  }

}
