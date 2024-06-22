import { toast } from 'react-toast'

export default {
  success: (message: string) => {
    toast.success(message)
  },
  warning: (message: string) => {
    toast.warn(message)
  },
  info: (message: string) => {
    toast.info(message)
  },
  error: (message: string) => {
    toast.error(message)
  }
}
