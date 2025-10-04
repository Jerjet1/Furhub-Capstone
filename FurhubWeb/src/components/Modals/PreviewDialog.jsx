import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export const PreviewDialog = ({
  open,
  setOpen,
  previewURL,
  onConfirm,
  onCancel,
}) => {
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // When dialog is closing (via X button or backdrop click)
      onCancel(); // Call your cancel handler to clean up
    }
    setOpen(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Preview Photo
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-md">
          This is a preview of the photo you selected. Confirm to upload or
          cancel.
        </DialogDescription>

        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            className="h-80 w-80 mx-auto rounded-full"
          />
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="hover:bg-[#e6e3e3]">
            Cancel
          </Button>
          <Button
            className="bg-[#4285F4] hover:bg-[#1976D2] text-white"
            onClick={onConfirm}>
            Confirm Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
