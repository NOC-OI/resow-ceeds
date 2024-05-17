interface CustomUploadFileProps {
  onChange: any
  label: string
  text?: string
  inputId?: string
}

export function CustomUploadFile({
  label,
  onChange,
  text,
  inputId,
}: CustomUploadFileProps) {
  return (
    <div className="flex justify-between w-full items-center pt-2">
      <p className="pt-4 text-md font-bold text-white mb-2 text-center">
        {text || 'Upload File'}
      </p>
      <div className="flex justify-center gap-2 items-center">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={inputId || 'file_input'}
        >
          Upload file:
        </label>
        <input
          id={inputId || 'file_input'}
          type="file"
          style={{ display: 'none' }}
          onChange={onChange}
        />
        <label
          htmlFor={inputId || 'file_input'}
          className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80"
          style={{
            padding: '10px',
            textAlign: 'center',
          }}
        >
          {label}
        </label>
      </div>
    </div>
  )
}
