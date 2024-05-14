import WarningIcon from '@mui/icons-material/Warning'
import { Button } from '@mui/material'

export function ConfirmationDialog({ onClose, onConfirm, message }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog text-white ">
      <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
        <div className="bg-black bg-opacity-60 rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-20 z-50 mb-4 mx-4 md:relative shadow-lg">
          <div className="md:flex items-center">
            <WarningIcon style={{ color: 'white' }} />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <p className="font-bold text-center">Warning!</p>
              <p className="text-md mt-4">{message}</p>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:flex md:justify-end gap-2">
            <Button
              variant="outlined"
              className="w-full"
              color="error"
              id="confirm-delete-btn"
              onClick={onConfirm}
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              className="w-full"
              id="confirm-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
