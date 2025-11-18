import { LightningElement, api, track } from 'lwc';

export default class LookupContact extends LightningElement {
    @api label = 'Lookup';
    @api records = []; // [{label, value}]
    
    @track searchKey = '';
    @track results = [];
    @track selectedRecord = null;

    showDropdown = false;

    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();

        // filter results
        this.results = this.records.filter(r =>
            r.label.toLowerCase().includes(this.searchKey)
        );

        this.showDropdown = this.results.length > 0;
    }

    handleSelect(event) {
        const id = event.currentTarget.dataset.id;
        const label = event.currentTarget.dataset.label;

        this.selectedRecord = { value: id, label: label };
        this.showDropdown = false;

        // send to flow
        this.dispatchEvent(
            new CustomEvent('contactselected', { detail: id })
        );
    }

    clearSelection() {
        this.selectedRecord = null;
        this.searchKey = '';
        this.showDropdown = false;

        this.dispatchEvent(
            new CustomEvent('contactselected', { detail: null })
        );
    }
}
