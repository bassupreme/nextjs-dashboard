import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  {
    /*
        <Breadcrumbs/> è un componente che si vede
        nella parte superiore della pagina, che da 
        informazioni utili alla navigazione.

        <Form /> è un wrapper di un form in HTML.
        Questo permette di passare al form dei dati;
        in questo caso, viene passata al form una
        lista di clienti.
    */
  }

  return (
    <main>
      
      <Breadcrumbs 
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} /> 
    </main>
  );
}