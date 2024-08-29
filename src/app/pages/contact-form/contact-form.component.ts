import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importa FormsModule para usar ngModel
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Asegúrate de importar FormsModule aquí
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactService.getContact(+id).subscribe((data) => {
        this.contact = data;
      });
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
