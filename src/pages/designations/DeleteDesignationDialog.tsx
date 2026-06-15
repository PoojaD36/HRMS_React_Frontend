import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Designation } from '@/lib/api/designationApi';

interface DeleteDesignationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  designation: Designation | null;
  isDeleting: boolean;
}

export function DeleteDesignationDialog({
  open,
  onClose,
  onConfirm,
  designation,
  isDeleting,
}: DeleteDesignationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-lg">Delete Designation</DialogTitle>
          </div>
        </div>

        <DialogDescription className="text-base">
          Are you sure you want to delete <strong>{designation?.name}</strong>? This action cannot be
          undone.
        </DialogDescription>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Designation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
