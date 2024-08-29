import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  Updater
} from '@tanstack/angular-table';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FlexRenderDirective],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts = signal<Contact[]>([]);
  searchTerm: string = '';
  pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  totalRecords = signal<number>(0);

  columns: ColumnDef<Contact>[] = [
    {
      accessorKey: 'name',
      cell: info => info.getValue(),
      header: 'First Name',
    },
    {
      accessorKey: 'surname',
      cell: info => info.getValue(),
      header: 'Last Name',
    },
    {
      accessorKey: 'phones',
      header: 'Phone Numbers',
      cell: info => {
        const phones = info.getValue() as { phone_number: string }[];
        return phones?.map(phone => phone.phone_number).join(', ') || 'N/A';
      },
    },
    {
      accessorKey: 'emails',
      header: 'Email Addresses',
      cell: info => {
        const emails = info.getValue() as { email_address: string }[];
        return emails?.map(email => email.email_address).join(', ') || 'N/A';
      },
    },
    {
      accessorKey: 'addresses',
      header: 'Addresses',
      cell: info => {
        const addresses = info.getValue() as { street: string, city: string, zipcode: string }[];
        return addresses?.map(address => `${address.street}, ${address.city}, ${address.zipcode}`).join('; ') || 'N/A';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const contact = row?.original as Contact;
        return `
          <ng-container>
            <a routerLink="/contacts/${contact?.id}" class="btn btn-info btn-sm self-stretch w-full flex">View</a>
            <a routerLink="/contacts/edit/${contact?.id}" class="btn btn-warning btn-sm self-stretch w-full flex">Edit</a>
            <button class="btn btn-danger btn-sm cursor-pointer" (click)="deleteContact(${contact?.id})">Delete</button>
          </ng-container>
        `;
      },
    }

  ];

  table = createAngularTable(() => ({
    data: this.contacts(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(this.totalRecords() / this.pagination().pageSize),
    state: {
      pagination: this.pagination(),
    },
    onPaginationChange: this.handlePaginationChange.bind(this),
  }));

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadContacts(1);
  }

  loadContacts(page: number): void {
    this.contactService.getContacts(page).subscribe((response) => {
      this.contacts.set(response.data);
      this.totalRecords.set(response.total);
    });
  }

  handlePaginationChange(updaterOrValue: Updater<PaginationState>): void {
    const newPaginationState = typeof updaterOrValue === 'function'
      ? updaterOrValue(this.pagination())
      : updaterOrValue;

    this.pagination.set(newPaginationState);
    this.loadContacts(newPaginationState.pageIndex + 1);
  }

  filterContacts(): void {
    if (this.searchTerm) {
      const filtered = this.contacts().filter(contact =>
        contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.surname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.contacts.set(filtered);
    } else {
      this.loadContacts(this.pagination().pageIndex + 1);
    }
  }

  deleteContact(contactId: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(contactId).subscribe(() => {
        this.loadContacts(this.pagination().pageIndex + 1);
      }, error => {
        console.error('Error deleting contact:', error);
      });
    }
  }


  trackByHeaderGroupId(index: number, group: any): any {
    return group.id;
  }

  trackByHeaderId(index: number, header: any): any {
    return header.id;
  }

  trackByRowId(index: number, row: any): any {
    return row.id;
  }

  trackByCellId(index: number, cell: any): any {
    return cell.id;
  }

  trackByFooterGroupId(index: number, group: any): any {
    return group.id;
  }

  trackByFooterId(index: number, footer: any): any {
    return footer.id;
  }
}
