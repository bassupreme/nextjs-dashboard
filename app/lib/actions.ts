'use server';
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

 
export async function createInvoice(formData: FormData) {
  // tip della documentazione
  const rawFormData = Object.fromEntries(formData.entries()); 

  // Test it out:
  console.log(rawFormData);
}