import { createPortal } from 'react-dom';

interface ActionMenuProps {
  open?: boolean;
  onClose?: () => void;
  onClickOutside?: () => void;
  position?: { top: number; left: number };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}


function ActionMenu({ open, onClose, position, onView, onEdit, onDelete }: ActionMenuProps) {
    

  if (!open || !position) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div 
        style={{ top: position.top, left: position.left }}
        className="fixed w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-in fade-in duration-100"
      >
        <ul className="py-1 text-gray-800">
          <li><button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { onView?.(); onClose?.(); }}>View</button></li>
          <li><button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { onEdit?.(); onClose?.(); }}>Edit</button></li>
          <li><button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => { onDelete?.(); onClose?.(); }}>Delete</button></li>
        </ul>
      </div>
    </>,
    document.body
  );
}

export default ActionMenu;