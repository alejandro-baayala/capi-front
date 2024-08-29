import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  contact: Contact = new Contact();
  isEditMode = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contact = {
      name: '',
      surname: '',
      phones: [{ phone_number: '' }],
      emails: [{ email_address: '' }],
      addresses: [{ street: '', city: '', zipcode: '' }]
    };

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactService.getContact(+id).subscribe((data) => {
        this.contact = data;
      });
    }
  }

  addPhone(): void {
    this.contact.phones.push({ phone_number: '' });
  }

  removePhone(): void {
    if (this.contact.phones.length > 1) {
      this.contact.phones.pop();
    }
  }

  addEmail(): void {
    this.contact.emails.push({ email_address: '' });
  }

  removeEmail(): void {
    if (this.contact.emails.length > 1) {
      this.contact.emails.pop();
    }
  }

  addAddress(): void {
    this.contact.addresses.push({ street: '', city: '', zipcode: '' });
  }

  removeAddress(): void {
    if (this.contact.addresses.length > 1) {
      this.contact.addresses.pop();
    }
  }

  saveContact(): void {
    if (this.isEditMode) {
      this.contactService.updateContact(this.contact.id!, this.contact).subscribe(() => {
        this.router.navigate(['/contacts']);
      });
    } else {
      this.contactService.createContact(this.contact).subscribe(() => {
        this.router.navigate(['/contacts']);
      });
    }
  }
}
