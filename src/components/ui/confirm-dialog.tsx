import type { ReactNode } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  finalFocus?: AlertDialog.Popup.Props["finalFocus"];
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  finalFocus,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-surface-scrim transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <AlertDialog.Popup
          finalFocus={finalFocus}
          className="glass fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-card border border-glass-border bg-surface-dialog p-5 transition-[opacity,scale] duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 md:p-6"
        >
          <AlertDialog.Title className="text-base font-medium text-foreground md:text-lg">
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </AlertDialog.Description>
          
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 rounded-row border border-glass-border bg-surface-input bg-clip-border px-4 text-foreground hover:bg-surface-row md:h-10"
                />
              }
            >
              {cancelLabel}
            </AlertDialog.Close>

            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="h-11 rounded-row border border-destructive/30 px-4 md:h-10"
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
