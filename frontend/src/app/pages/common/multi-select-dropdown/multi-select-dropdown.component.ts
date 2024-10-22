import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-multi-select-dropdown',
    templateUrl: './multi-select-dropdown.component.html',
    styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
    @Input() list: any[] | undefined;

    @Output() shareCheckedList = new EventEmitter();
    @Output() shareIndividualCheckedList = new EventEmitter();


    checkedList: any[];
    currentSelected: {} | undefined;
    showDropDown: boolean = false;


    constructor() {
        this.checkedList = [];
        this.list = [
            { name :'Residents', checked : false },
            { name :'Male', checked : false },
            { name :'Female', checked : false },
            // { name :'Documents', checked : false },
            { name :'Income', checked : false }
        ];
    }

    getSelectedValue(status: boolean, value: string) {
        if (status) {
            if (this.checkedList.length < 2) {
                this.checkedList.push(value);
            } else {
                // If already 2 items selected, prevent further selection
                return;
            }
        } else {
            var index = this.checkedList.indexOf(value);
            this.checkedList.splice(index, 1);
        }
    
        this.currentSelected = { checked: status, name: value };
    
        this.shareCheckedlist();
    
        this.shareIndividualStatus();
    }
    
    shareCheckedlist() {
        this.shareCheckedList.emit(this.checkedList);
    }
    shareIndividualStatus() {
        this.shareIndividualCheckedList.emit(this.currentSelected);
    }
}