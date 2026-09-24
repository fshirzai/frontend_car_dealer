import { Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Car className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Car Dealership</span>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}