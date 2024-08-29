export class Contact {
  id?: number;
  name: string = '';
  surname: string = '';
  phones: { phone_number: string }[] = [];
  emails: { email_address: string }[] = [];
  addresses: { city: string, street: string, zipcode: string }[] = [];
}
