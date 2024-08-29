export class Contact {
  id?: number;
  name: string = '';
  surname: string = '';
  phones: { phone_number: string }[] = [];
  emails: { email_address: string }[] = [];
  addresses: { street: string, city: string, zipcode: string }[] = [];
}
