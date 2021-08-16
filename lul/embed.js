/**
 * This class is only for initializing the Lia UI Library.
 * It does not hold any [functions]{@link LulFunctions}.
 *
 */
export class LulConfig {

  /**
   * Initializes the library with the default values.
   * @constructor
   */
  constructor() {
    /** The default css-classname to apply to a
     * [box]{@link LulFunctions.genBox}
     * @default
     */
    this.BOX_CLASS = 'lul-padding lul-light';

    /** Let **collapsible** be a [collapsible]{@link LulFunctions.genCollapsible} generated  
     * with a **hover** controlling its expansion/collapse.
     *
     * Now, when the cursor leaves the **hover** element,  
     * the **collapsible** gets collapsed.  
     * For better UX however, there is a delay,  
     * which is specified here.
     * @default
     */
    this.HOVER_COLLAPSE_DELAY = '0.45s';

    /** When a [collapsible]{@link LulFunctions.genCollapsible} gets created,  
     * there is a delay before the specified
     * **hover** and/or **toggle** element gets activated.
     *
     * Its length in milliseconds is specified here
     * @default
     */
    this.HOVER_INITIAL_DELAY_MS = 80;

    /** An Object with two properties:
     * * **width**: css classname for horizontal collapsibles
     * * **height**: css classname for vertical collapsibles
     *
     * Whether a [collapsible]{@link LulFunctions.genCollapsible}  
     * is horizontal or vertical  
     * depends on its **direction** parameter  
     * (set when creating the collapsible via genCollapsible).
     * @default
     */
    this.COLLAPSIBLE_CLASS_MAP = {
      width: 'lul-collapsible-width',
      height: 'lul-collapsible-height'
    };
  
    //it's best to leave these two as they are
    this.DEFAULT_OVERFLOW_CLASS = 'lul-overflow';
    this.DEFAULT_OVERFLOW_PARENT_CLASS = 'lul-overflow-parent';

    /** The css class [buttons]{@link LulFunctions.genButton} have by default.
     * @default
     */
    this.DEFAULT_BUTTON_CLASS = 'lul-dark lul-medium-hover lul-norm-height';

    /** An Object with 4 properties (**radio**, **check**, **range**, **enter**).  
     * Each describes one type of input element  
     * and specifies the following:
     * * **className**: the css-classname to apply to the input-element
     * * **width**: the desired width in px. Can be overriden when  
     * creating a [range]{LulFunctions.genRange} or a [text enter area]{LulFunctions.genEnter}
     * * **inputType**: defines the **type** attribute of the html input-element
     * * **widthProperty**: defines the css property for width
     * *see source code for default value*
     */
    this.INPUT_ELEMENTS = {
      radio: {
        className: 'lia-radio',
        width: 0,
        inputType: 'radio',
        widthProperty: 'minWidth'
      },
      check: {
        className: 'lia-checkbox',
        width: 0,
        inputType: 'checkbox',
        widthProperty: 'minWidth'
      },
      range: {
        className: 'lia-range',
        width: 225,
        inputType: 'range',
        widthProperty: 'width'
      },
      enter: {
        className: 'lia-input',
        width: 225,
        inputType: 'text',
        widthProperty: 'width'
      }
    }; 

    /**the default css class of a selected [buttonRadio-Element]{@link LulFunctions.genButtonRadioArray} 
     */
    this.SELECTED_BUTTON_RADIO_CLASSNAME = 'lul-dark';
    /**the default css class of an unselected [buttonRadio-Element]{@link LulFunctions.genButtonRadioArray} 
     */
    this.UNSELECTED_BUTTON_RADIO_CLASSNAME = 'lul-light lul-medium-hover';

    /** when creating a [buttonRadioArray]{@link LulFunctions.genButtonRadioArray},  
     * the **direction** is determined by whether or not the sum of the *widths*  
     * of all the options exceeds this value.
     * @default
     */
    this.MAX_SELECTION_WIDTH = 500;
  }

  apply() {
    window['lulConfig'] = this;
  }

}
