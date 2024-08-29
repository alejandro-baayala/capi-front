import { Routes } from '@angular/router';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactListComponent },
  { path: 'contacts/add', component: ContactFormComponent },
  { path: 'contacts/edit/:id', component: ContactFormComponent },
  { path: 'contacts/:id', component: ContactDetailsComponent },
];
