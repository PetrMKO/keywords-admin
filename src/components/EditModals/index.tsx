import React from 'react';
import {EntityType} from "../EntityViewer";
import {Modal, Paper} from "@mui/material";

type EditModalProps = {
  entity: EntityType
  id: number
  onClose: ()=>void
  open: boolean
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const EditModal = ({entity, id, onClose, open}:EditModalProps) => {

  return (
    <Modal  onClose={onClose} open={open}>
      <Paper sx={style}>
        {entity}
        {id}
      </Paper>
    </Modal>
  );
};

export default EditModal;
