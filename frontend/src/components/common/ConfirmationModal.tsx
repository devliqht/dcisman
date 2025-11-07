import React from 'react';
import { Card, Button } from '@/components/ui';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
      <Card className='bg-black border-4 border-ghost-red p-6 max-w-md w-full mx-4'>
        <div className='text-center mb-4'>
          <h2 className='text-ghost-red font-family-arcade text-3xl drop-shadow-lg mb-2'>
            {title}
          </h2>
          <p className='text-gray-300 font-family-vt323 text-xl'>{message}</p>
        </div>

        <div className='flex gap-3 mt-6'>
          <Button
            onClick={onCancel}
            variant='secondary'
            className='flex-1 font-family-arcade text-lg py-3'
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmVariant}
            className='flex-1 font-family-arcade text-lg py-3'
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
};
