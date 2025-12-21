import { Suspense } from 'react';
import AddAppointmentForm from './AddAppointmentForm';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddAppointmentForm />
    </Suspense>
  );
}
