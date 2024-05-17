import WarningIcon from '@mui/icons-material/Warning'
import { Button } from '@mui/material'

export function ConfirmationDialog({ onClose, onConfirm, message }) {
  return (
    <div className="fixed inset-0 flex items-center !justify-center z-[9999] backdrop-blur confirm-dialog text-white">
      <div className="bg-black bg-opacity-60 rounded-lg p-4 max-w-md w-full mx-4 shadow-lg !block">
        <div className="flex items-center">
          <WarningIcon style={{ color: 'white' }} />
          <div className="ml-4 !text-center md:text-left !block">
            <p className="font-bold">Warning!</p>
            <p className="text-md mt-4">{message}</p>
          </div>
        </div>
        <div className="text-center md:text-right mt-4 flex justify-end gap-2">
          <Button
            variant="outlined"
            className="w-full md:w-auto !bg-black !font-bold"
            color="error"
            id="confirm-delete-btn"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            className="w-full md:w-auto !bg-black !font-bold"
            id="confirm-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
