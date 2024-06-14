import React, { useContext } from 'react';
import { Modal, Form } from 'react-bootstrap';

import { ThemeContext } from '../../reading_page_theme';

function SettingModal({ show, handleClose }) {

    const { theme } = useContext(ThemeContext);
    const support_text_color=[{value:"#FFFFFF",name:"Trắng"},
                              {value:"#000000",name:"Đen"},
                              {value:"#FF0000",name:"Đỏ"},
                              {value:"#0000FF",name:"Xanh dương"},
                              {value:"#00FF00",name:"Xanh lá"},
                              {value:"#FFFF00",name:"Vàng"},
                              {value:"#FFA500",name:"Da cam"},
                              {value:"#800080",name:"Tím"},
                              {value:"#00FFFF",name:"Xanh lơ"},
                              {value:"#FFC0CB",name:"Hồng"}];
    const support_font_family=[{value:"Times New Roman, serif",name:"Times New Roman"},
                                {value:"Arial, sans-serif",name:"Arial"},
                                {value:"Verdana, sans-serif",name:"Verdana"},
                                {value:"Tahoma, sans-serif",name:"Tahoma"},
                                {value:"Courier New, monospace",name:"Courier New"},];
    const support_background_color=[...support_text_color];
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
            <Modal.Header style={{ color: '#000' }}  closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#232323', color: '#fff' }}>
                <Form.Group controlId="formTextColor">
                    <Form.Label>Màu chữ</Form.Label>
                    <Form.Control as="select" defaultValue={theme.fontColor} onChange={handleFontColorChange}>
                        {support_text_color.map(color=>{
                            return <option value={color.value}>{color.name}</option>})
                        }
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formFontSize">
                    <Form.Label>Cỡ chữ</Form.Label>
                    <Form.Control type="number" defaultValue={parseInt(theme.fontSize)} onChange={handleFontSizeChange} />
                </Form.Group>

                <Form.Group controlId="formFontFamily">
                    <Form.Label>Font chữ</Form.Label>
                    <Form.Control as="select" defaultValue={theme.fontFamily} onChange={handleFontFamilyChange}>
                        {support_font_family.map(font=>{
                            return <option value={font.value}>{font.name}</option>
                        })}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBackgroundColor">
                    <Form.Label>Màu nền</Form.Label>
                    <Form.Control as="select" defaultValue={theme.backgroundColor} onChange={handleBackgroundColorChange}>
                        {support_background_color.map(color=>{
                            return <option value={color.value}>{color.name}</option>})
                        }
                    </Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#121212', color: '#fff' }}/>
        </Modal>
        </>
    );
};
export default SettingModal;