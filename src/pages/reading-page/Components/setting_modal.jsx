import React, { useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ThemeContext } from '../readingTheme';

export default function SettingModal({ show, handleClose }) {

  const { theme } = useContext(ThemeContext);
  
  const { updateBackgroundColor,
    updateFontFamily,
    updateFontColor,
    updateFontSize,
  } = useContext(ThemeContext);

  const handleFontSizeChange = (event) => {
    updateFontSize(parseInt(event.target.value))
    // readingTheme.fontSize = event.target.value
  }
  const handleFontColorChange = (event) => {
    updateFontColor(event.target.value)
    // readingTheme.fontColor = event.target.
  }
  const handleFontFamilyChange = (event) => {
    // readingTheme.fontFamily = event.target.value
    updateFontFamily(event.target.value)

  }

  const handleBackgroundColorChange = (event) => {
    // readingTheme.backgroundColor = event.target.value
    updateBackgroundColor(event.target.value)

  }
  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}

      <Modal show={show} onHide={handleClose} style={{position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: 450,
                                                    height: 600,
                                                    color:'white',
                                                    borderRadius: 12,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                    padding: '24px 32px'}}>
        <Modal.Header style={{ backgroundColor: '#000', color: '#fff' }} closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#232323', color: '#fff' }}>
          {/* <Form> */}
          <Form.Group controlId="formTextColor">
            <Form.Label>Màu chữ</Form.Label>
            <Form.Control as="select" defaultValue={theme.fontColor} onChange={handleFontColorChange}>
              <option value="#FFFFFF">Trắng</option>
              <option value="#000000">Đen</option>
              <option value="#FF0000">Đỏ</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formFontSize">
            <Form.Label>Cỡ chữ</Form.Label>
            <Form.Control type="number" defaultValue={parseInt(theme.fontSize)} onChange={handleFontSizeChange} />
          </Form.Group>

          <Form.Group controlId="formFontFamily">
            <Form.Label>Font chữ</Form.Label>
            <Form.Control as="select" defaultValue={theme.fontFamily} onChange={handleFontFamilyChange}>
              <option value='Times New Roman, serif'>Time News Roman</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBackgroundColor" >
            <Form.Label>Màu nền</Form.Label>
            <Form.Control as="select" defaultValue={theme.backgroundColor} onChange={handleBackgroundColorChange}>
              <option value="#000000">Đen</option>
              <option value="#FFFFFF">Trắng</option>
              <option value='#0000FF'>Xanh dương</option>
              <option value='#FF0000'>Đỏ</option>
              <option value='#FFFF00'>Vàng</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#000', color: '#fff' }}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};
