/***********
 * RB-TABLE
 ***********/
import { RbBase, props, html } from '../../base/scripts/base.js';
import template                from '../views/rb-table.html';
import Type                    from '../../base/scripts/public/services/type.js';
import View                    from '../../base/scripts/public/view/directives.js';

export class RbTable extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.version = '0.0.3';
		this.state = {
			...super.state,
			orderDirection: 'asc',
			orderKey: '',
			gridTemplateColumns: {}

		}
	}

	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			columns: null,
			slot:  this.shadowRoot.querySelector('slot'),
			root: this.shadowRoot.querySelector('.container')
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

		this._setGridStyle();
	}

	_onclick(key, column, evt) { // :void
		this._setCaptionActiveState(key, evt);
		this._setSortOrderAndDirection(key);
		this._sortOnClient(key)
	}

	_setCaptionActiveState(key, evt) {
		this.captions = !this.captions ? this.shadowRoot.querySelectorAll('caption') : this.captions
		this.captions.forEach((item) => {
			item.classList.remove("active")
		})
		evt.currentTarget.classList.add("active");
	}

	_setSortOrderAndDirection(key) {
		this.state.orderDirection = this.state.orderKey == key && this.state.orderDirection == 'asc' ? 'desc' : 'asc';
		this.state.orderKey = key;
	}

	_setGridStyle() {
		this.state.gridTemplateColumns['grid-template-columns'] = this._buildColumnWidth()
	}

	_buildColumnWidth() {
		const arrColumnWidths = [];
		this.rb.elms.columns.forEach((item) => {
			arrColumnWidths.push(item.getAttribute('width'))
		})

		let columnWidths = ''
		arrColumnWidths.forEach((width) => {
			switch(true) {
				case !width:
					columnWidths += '1fr ';
					break;
				case width.includes('%'):
					columnWidths += Number(width.replace('%',''))/10 + 'fr ';
					break;
				case width.includes('px'):
					columnWidths += width + ' '
					break;
				default:
					columnWidths += width + ' ';
					break
			}
		})
		return columnWidths;
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
			}),
			columnAlign: Object.assign({}, props.string, {
				default: 'left'
			}),
			captionAlign: Object.assign({}, props.string, {
				default: 'left'
			})
		}
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

			return this.state.orderDirection == 'asc' ? a[key] - b[key] : b[key] - a[key];
		});
	}

	// sort by name
	_sortByName(key) {
		this.data = this.data.sort((a, b) =>{
			var nameA = this.state.orderDirection == 'asc' ? a[key].toUpperCase() : b[key].toUpperCase(); // ignore upper and lowercase
			var nameB = this.state.orderDirection == 'asc' ? b[key].toUpperCase() : a[key].toUpperCase();  // ignore upper and lowercase
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
