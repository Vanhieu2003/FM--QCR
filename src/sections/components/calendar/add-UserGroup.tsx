import React, { useEffect, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent,ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

interface AddCalendarItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
  onEdit?: (id: string, name: string, color: string) => void;
  type: 'add' | 'edit';
  initialData?: { id: string; name: string; color: string };
}

const AddCalendarItemDialog = ({ isOpen, onClose, onAdd,onEdit, type, initialData }: AddCalendarItemDialogProps) => {
  const [itemName, setItemName] = useState('');
  const [itemColor, setItemColor] = useState('#000000');

  useEffect(() => {
    if (type === 'edit' && initialData) {
      setItemName(initialData.name);
      setItemColor(initialData.color);
    } else {
      setItemName('');
      setItemColor('#000000');
    }
  }, [type, initialData, isOpen]);

  const handleAction = () => {
    if (itemName.trim()) {
      if (type === 'add') {
        onAdd(itemName.trim(), itemColor);
      } else if (type === 'edit' && initialData && onEdit) {
        onEdit(initialData.id, itemName.trim(), itemColor);
      }
      onClose();
    }
  };

  return (
    <DialogComponent width="300px" isModal={true} visible={isOpen} close={onClose}>
      <div style={{ padding: '20px' }}>
        <h2>{type === 'add' ? 'Thêm nhóm người dùng mới' : 'Chỉnh sửa nhóm người dùng'}</h2>
        <TextBoxComponent
          placeholder="Nhập tên"
          value={itemName}
          change={(e) => setItemName(e.value as string)}
        />
        <div style={{ marginTop: '10px' }}>
          <ColorPickerComponent
            value={itemColor}
            change={(args) => setItemColor(args.currentValue.hex)}
          />
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonComponent onClick={onClose} style={{ marginRight: '10px' }}>Hủy</ButtonComponent>
          <ButtonComponent isPrimary={true} onClick={handleAction}>
            {type === 'add' ? 'Thêm' : 'Cập nhật'}
          </ButtonComponent>
        </div>
      </div>
    </DialogComponent>
  );
};

export default AddCalendarItemDialog;