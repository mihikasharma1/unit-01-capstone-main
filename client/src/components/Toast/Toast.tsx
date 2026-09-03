import './Toast.css';

type ToastProps = { message: string; onClose: () => void };

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}