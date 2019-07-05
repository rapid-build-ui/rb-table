/***********
 * RB-TABLE
 ***********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import template                from '../views/rb-table.html';

export class RbTable extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.version = '0.0.0';
	}

	/* Properties
	 *************/
	static get props() {
		return {
			kind: Object.assign({}, props.string, {
				default: 'default'
			})
		};
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-table', RbTable);
