import { LightningElement, api, wire, track } from 'lwc';
import getExpertContacts from '@salesforce/apex/ExpertContactController.getExpertContacts';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class ExpertContactLookup extends LightningElement {
    @api recordId;
    @api selectedContactId;
    @track contactOptions = [];

    @wire(getExpertContacts, { caseId: '$recordId' })
    wiredContacts({ data, error }) {
        if (data) {
            this.contactOptions = data.map(
                c => ({ label: c.Name, value: c.Id })
            );
        } else if (error) {
            this.contactOptions = [];
            console.error(error);
        }
    }

    handleSelect(event) {
        this.selectedContactId = event.detail;

        this.dispatchEvent(
            new FlowAttributeChangeEvent('selectedContactId', this.selectedContactId)
        );
    }
}
