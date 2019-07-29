/***********
 * RB-TABLE
 ***********/
import { RbBase, props, html } from '../../base/scripts/base.js';
import template                from '../views/rb-table.html';
import Type                    from '../../base/scripts/public/services/type.js';

export class RbTable extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.version = '0.0.3';
		this.state = {
			...super.state,
			_orderDirection: 'asc',
			_orderKey: ''
		}
	}

	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			columns: null,
			slot:  this.shadowRoot.querySelector('slot')
		});
		this._attachEvents();
		this.triggerUpdate();
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this._setColumns();
		this.rb.events.add(this.rb.elms.slot, 'slotchange', this._setColumns);

	}

	/* Event Handlers
	 *****************/
	_setColumns(e) { // :void (columns = element[])
		this.rb.elms.columns = this.rb.elms.slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'column');
	}

	_onclick(key, column, evt) { // :void
		this._setCaptionActiveState(key, evt);
		this._setSortOrderAndDirection(key);
		this._sortOnClient(key)
	}

	_setCaptionActiveState(key, evt) {
		this.captions = !this.captions ? this.shadowRoot.querySelectorAll('caption') : this.captions
		this.captions.forEach((item) =>{
			item.classList.remove("active")
		})
		evt.currentTarget.classList.add("active");
	}

	_setSortOrderAndDirection(key) {
		this.state._orderDirection = this.state._orderKey == key && this.state._orderDirection == 'asc' ? 'desc' : 'asc';
		this.state._orderKey = key;
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			data: Object.assign({}, props.array, {
				deserialize(val) { // :array
					if (val === 'undefined') return val;
					if (Type.is.array(val)) return val;
					if (!Type.is.string(val)) return val;
					val = val.trim();
					if (/^\[[^]*\]$/.test(val)) {
						val = JSON.parse(val);
					}
					return val;
				}
			})
		};
	}


	/* Help Methods
	 *****************/
	// sort by value

	_sortOnClient(key) {
		if(Type.is.number(this.data[0][key]))
			return this._sortByValue(key);
		return this._sortByName(key);
	}

	_sortByValue(key) {
		this.data = this.data.sort((a, b) => {
			// console.log(this.state);
			// return a[key] - b[key]
			return this.state._orderDirection == 'asc' ? a[key] - b[key] : b[key] - a[key];
		});
	}

	// sort by name
	_sortByName(key) {
		this.data = this.data.sort((a, b) =>{
			var nameA = this.state._orderDirection == 'asc' ? a[key].toUpperCase() : b[key].toUpperCase(); // ignore upper and lowercase
			var nameB = this.state._orderDirection == 'asc' ? b[key].toUpperCase() : a[key].toUpperCase();  // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	}

	/* Template
	 ***********/
	render({ props , state}) { // :string
		return html template;
	}
}

customElements.define('rb-table', RbTable);
