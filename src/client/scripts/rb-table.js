/***********
 * RB-TABLE
 ***********/
import { RbBase, props, html } from '../../base/scripts/base.js';
import template                from '../views/rb-table.html';

export class RbTable extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.version = '0.0.1';
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
