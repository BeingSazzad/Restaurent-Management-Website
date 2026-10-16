import React from 'react';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBF9F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-stone-900 text-[#F15A24] flex items-center justify-center shadow-lg mb-4">
        <ChefHat className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">404</h1>
      <p className="text-base font-semibold text-stone-800 mt-1">Kitchen Station Not Found</p>
      <p className="text-xs text-stone-500 max-w-sm mt-1 mb-6">
        The station or ticket route you requested does not exist or has been shifted off the expo line.
      </p>
      <Button
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate(ROUTES.DASHBOARD.ROOT)}
      >
        Back to KDS Pipeline
      </Button>
    </div>
  );
}

export default NotFoundPage;
