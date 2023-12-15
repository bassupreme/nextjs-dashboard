"use server";

/* 
    grazie alla direttiva presente all'internodi react 'use server', 
    tutte le funzioni che questo file esporta vengono eseguite direttamente nel server.
*/

/*
    La prop formData contiene dati che vengono passati automaticamente
    quando il form viene "submittato" (=> quando viene premuto il bottone create in questo caso).
    => di conseguenza possiamo estrarre in questa funzione tutti i dati immessi nel form
    e creare una query che permetta di inserire l'invoice creata all'interno del db.
*/

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // molto importane: PULIRE LA CACHE
import { redirect } from 'next/navigation';
import { RedirectStatusCode } from 'next/dist/client/components/redirect-status-code';

/*
    L'idea è quella di creare uno schemda che
    i dati inseriti nella form debbano rispettare. 
*/

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    // tip della documentazione

    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100; // aumnetare la precisione
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    revalidatePath('/dashboard/invoices'); // pulire la cache
    /* 
        questo vine fatto in quanto, nella cache vi è un route segment 
        (/dashboard/invoices/) contenente ancora i dati vecchi, in quanto
        è stato messo nella cache per favorire una navigazione più veloce.
        Una volta aggiornati i dati, non facendo quest'operazione la cache
        conterrebbe ancora una pagina contenente i dati vecchi.
    */ 
    redirect('/dashboard/invoices');


}
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}