
import { useAppDispatch, useAppSelector } from "./hooks"
import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import {  editSettingAction, editSettingSecAction } from "./Settings/settingsSlice"
import { uploadImage } from "./Editor/editorService"
import "./profile.css"
import AuroraPage from "./components/AuroraPage"

function Profile (){

    const dispatch = useAppDispatch()
    
    
    
    const websiteName =  useAppSelector ((state) => state.settings.websiteName)
    const logo =  useAppSelector ((state) => state.settings.logo)
    const loginImage =  useAppSelector ((state) => state.settings.loginPicture)
    const contactName =  useAppSelector ((state) => state.settings.contactName)
    const contactphonNumber =  useAppSelector ((state) => state.settings.PhoneNumber)
    const contactEmailAddress =  useAppSelector ((state) => state.settings.EmailAddress)
    const licenseModel =  useAppSelector ((state) => state.settings.licenseModel)
    const LicenseExpiration =  useAppSelector ((state) => state.settings.licenseExpiration)


    const [showContact, setShowContact] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [showEmail, setShowEmail] = useState(false)


    const [templogo, setTempLogo] = useState<string>("")
    const [tempWebsiteName, setTempWebsiteName] = useState<string>("")
    const [temploginImage, setTempLoginImage] = useState<string>("")

    const [showLogo, setShowLogo] = useState(false)
    const [showWSName, setShowWSName] = useState(false)
    const [showLoginImage, setShowLoginImage] = useState(false)
    const [showLicenses, setShowLicenses] = useState(false)
    const [logimg, setLogoimg] = useState<File | null>(null)
    const [picimg, setPicimg] = useState<File | null>(null)
  


    const [tempContactName, setTempContactName] = useState("")
    const [tempContactPhone, setTempContactPhone] = useState("")
    const [tempContactEmail, setTempContactEmail] = useState("")
    
    useEffect(()=> {setTempWebsiteName(websiteName || "")}, [websiteName])
    useEffect(()=> {setTempLogo(logo || "")}, [logo])
    useEffect(()=> {setTempLoginImage(loginImage || "")}, [loginImage])
    useEffect(()=> {setTempContactName(contactName || "")}, [contactName])
    useEffect(()=> {setTempContactPhone(contactphonNumber || "")}, [contactphonNumber])
    useEffect(()=> {setTempContactEmail(contactEmailAddress || "")}, [contactEmailAddress])

  
    return (
        <AuroraPage variant="default">
            {/* Profile Header */}
            <div className="profile-header">
                <h1>🌅 {websiteName || "Aurora Website"}</h1>
                <p>Configuración del Sistema y Perfil</p>
            </div>

            {/* Profile Content Grid */}
            <div className="profile-grid">
                {/* Website Customization Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <svg className="profile-card-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <h3>Personalización</h3>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-field">
                            <label className="profile-field-label">Nombre del Sitio</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={websiteName} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowWSName(true)}>
                                Editar
                            </button>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Logo</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={logo} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowLogo(true)}>
                                Editar
                            </button>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Imagen de Login</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={loginImage} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowLoginImage(true)}>
                                Editar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Information Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <svg className="profile-card-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <h3>Contacto</h3>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-field">
                            <label className="profile-field-label">Nombre de Contacto</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={contactName} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowContact(true)}>
                                Editar
                            </button>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Teléfono</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={contactphonNumber} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowPhone(true)}>
                                Editar
                            </button>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Email</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={contactEmailAddress} 
                                readOnly 
                                disabled
                            />
                            <button className="profile-edit-btn" onClick={() => setShowEmail(true)}>
                                Editar
                            </button>
                        </div>
                    </div>
                </div>

                {/* License Information Card */}
                <div className="profile-card license-card">
                    <div className="profile-card-header">
                        <svg className="profile-card-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3>Información de Licencia</h3>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-field">
                            <label className="profile-field-label">Modelo de Licencia</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={licenseModel} 
                                readOnly 
                                disabled
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Fecha de Expiración</label>
                            <input 
                                type="text" 
                                className="profile-field-value" 
                                value={LicenseExpiration} 
                                readOnly 
                                disabled
                            />
                        </div>

                        <div className="license-info">
                            <h5>Información Adicional</h5>
                            <p>Para obtener más información sobre la licencia actual y términos de uso, puede consultar los detalles completos.</p>
                            <div className="license-action">
                                <a 
                                    href="#" 
                                    className="license-link" 
                                    onClick={(e) => {e.preventDefault(); setShowLicenses(true)}}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                                    </svg>
                                    Ver Términos y Condiciones
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Website Name Modal */}
            <Modal show={showWSName} onHide={() => setShowWSName(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nombre del Sitio Web</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Configurar el nombre de la aplicación
                        </label>
                        <input 
                            type="text" 
                            className="modal-input"
                            placeholder="Ingrese el nombre del sitio web"
                            onChange={(e) => setTempWebsiteName(e.target.value)} 
                            value={tempWebsiteName}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowWSName(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern" 
                        onClick={() => {
                            dispatch(editSettingAction({Area:"Profile", Setting:"WebsiteName", Value: tempWebsiteName})); 
                            setShowWSName(false)
                        }}
                    > 
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Logo Modal */}
            <Modal show={showLogo} onHide={() => setShowLogo(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Configurar Logo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Seleccione un archivo PNG o SVG para el logo
                        </label>
                        <input 
                            type="file" 
                            className="modal-input"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setTempLogo(e.target.files[0].name); 
                                    setLogoimg(e.target.files[0]);
                                }
                            }} 
                            accept=".png,.svg"
                        />
                        {templogo && (
                            <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                                Archivo: {templogo}
                            </p>
                        )}
                        {logimg && (
                            <div className="image-preview">
                                <img src={URL.createObjectURL(logimg)} alt="Vista previa del logo" />
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowLogo(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern" 
                        onClick={() => {
                            if (logimg && templogo) {
                                uploadImage(logimg, templogo); 
                                dispatch(editSettingAction({Area:"Profile", Setting:"Logo", Value: templogo})); 
                                setShowLogo(false);
                            }
                        }}
                    >
                        Guardar Logo
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Login Image Modal */}
            <Modal show={showLoginImage} onHide={() => setShowLoginImage(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Imagen de Inicio de Sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Seleccione una imagen JPG o WebP (máximo 500 KB)
                        </label>
                        <input 
                            type="file" 
                            className="modal-input"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setTempLoginImage(e.target.files[0].name); 
                                    setPicimg(e.target.files[0]);
                                }
                            }} 
                            accept=".jpg,.jpeg,.webp"
                        />
                        {temploginImage && (
                            <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                                Archivo: {temploginImage}
                            </p>
                        )}
                        {picimg && (
                            <div className="image-preview">
                                <img src={URL.createObjectURL(picimg)} alt="Vista previa de la imagen de login" />
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowLoginImage(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern" 
                        onClick={() => {
                            if (picimg && temploginImage) {
                                uploadImage(picimg, temploginImage); 
                                dispatch(editSettingAction({Area:"Profile", Setting:"LoginPicture", Value: temploginImage})); 
                                setShowLoginImage(false);
                            }
                        }}
                    > 
                        Guardar Imagen
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Contact Name Modal */}
            <Modal show={showContact} onHide={() => setShowContact(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nombre de Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Configurar nombre de contacto técnico
                        </label>
                        <input 
                            type="text" 
                            className="modal-input"
                            placeholder="Ingrese el nombre de contacto"
                            value={tempContactName}  
                            onChange={(e) => setTempContactName(e.target.value)} 
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowContact(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern" 
                        onClick={() => {
                            dispatch(editSettingSecAction({Area:"Profile", Setting:"ContactName", Value: tempContactName})); 
                            setShowContact(false)
                        }}
                    > 
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Phone Modal */}
            <Modal show={showPhone} onHide={() => setShowPhone(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Teléfono de Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Configurar teléfono de contacto técnico
                        </label>
                        <input 
                            type="tel" 
                            className="modal-input"
                            placeholder="Ingrese el número de teléfono"
                            value={tempContactPhone} 
                            onChange={(e) => setTempContactPhone(e.target.value)} 
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowPhone(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern"   
                        onClick={() => {
                            dispatch(editSettingSecAction({Area:"Profile", Setting:"ContactPhone", Value: tempContactPhone})); 
                            setShowPhone(false)
                        }}
                    >
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Email Modal */}
            <Modal show={showEmail} onHide={() => setShowEmail(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Email de Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label className="modal-label">
                            Configurar email de contacto para soporte técnico
                        </label>
                        <input 
                            type="email" 
                            className="modal-input"
                            placeholder="contacto@ejemplo.com"
                            value={tempContactEmail} 
                            onChange={(e) => setTempContactEmail(e.target.value)} 
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-secondary-modern" 
                        onClick={() => setShowEmail(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-modern btn-primary-modern"   
                        onClick={() => {
                            dispatch(editSettingSecAction({Area:"Profile", Setting:"ContactEmail", Value: tempContactEmail})); 
                            setShowEmail(false)
                        }}
                    >
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </Modal>

            {/* License Terms Modal */}
            <Modal show={showLicenses} onHide={() => setShowLicenses(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Términos y Condiciones de Licencia</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    <div style={{padding: '20px'}}>
                        <h5 style={{color: 'var(--color-primary)', marginBottom: '20px'}}>TÉRMINOS Y CONDICIONES DE USO</h5>

                        <p style={{marginBottom: '15px'}}>
                            Esta página web es propiedad y está operado por licenciatario. 
                            Estos Términos establecen los términos y condiciones bajo los cuales puedes usar nuestra 
                            página web y nuestros servicios. Esta página web ofrece a los visitantes un porfolio profesional.
                            Al acceder o usar la página web, aceptas haber leído, entendido y 
                            aceptado estar sujeto a estos Términos:
                        </p>
                        
                        <h6 style={{color: 'var(--color-primary)', marginTop: '20px', marginBottom: '10px'}}>INFORMACIÓN RELEVANTE</h6>
                        <p style={{marginBottom: '15px'}}>
                            Para el uso de este servicio es necesario el registro por parte del usuario, 
                            con ingreso de datos personales fidedignos y definición de una contraseña. El usuario puede 
                            elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier 
                            momento, en caso de que se haya registrado y que sea necesario para la uso de 
                            nuestros servicios. El provedor del servicio no asume la responsabilidad en caso de que el titular de la pagina web 
                            entregue dicha clave a terceros.
                        </p>

                        <p style={{marginBottom: '15px'}}>
                            Todas las transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un 
                            proceso de confirmación y verificación, el cual podría incluir la validación de la forma de 
                            pago, validación de la factura (en caso de existir) y el cumplimiento de las condiciones 
                            requeridas por el medio de pago seleccionado. En algunos casos puede que se requiera una 
                            verificación por medio de correo electrónico. 
                            Los precios de los servicios ofrecidos en esta web son válidos solamente en las suscripciones 
                            realizadas en este sitio web.
                        </p>

                        <h6 style={{color: 'var(--color-primary)', marginTop: '20px', marginBottom: '10px'}}>LICENCIA CONTRATADA</h6>
                        <p style={{marginBottom: '15px'}}>
                            2024@ConscioCMS web design content management es un servicio de alojamiento y manejo de contenido para páginas web.
                            Este servicio solo podrá ser utilizado con este fin y con las limitaciones que se describen en esta licencia.
                        </p>

                        <p style={{marginBottom: '15px'}}>
                            Usted ha contratado una licencia Basic de contenido con las siguientes restricciones:
                        </p>

                        <ul style={{marginBottom: '20px', paddingLeft: '20px'}}>
                            <li style={{marginBottom: '8px'}}>El contenido máximo de almacenamiento por esta licencia son 300 MB por la cantidad total de contenido.</li>
                            <li style={{marginBottom: '8px'}}>El máximo de visitas para este nivel de licencia será de 1000 visitas al mes.</li>
                            <li style={{marginBottom: '8px'}}>Esta licencia solo permite acceso a un único usuario para manejar y editar el contenido del website.</li>
                            <li style={{marginBottom: '8px'}}>El soporte de esta licencia se limitará a mantener la página web operativa.</li>
                            <li style={{marginBottom: '8px'}}>Este servicio se provee usando infraestructura de Amazon Web Service.</li>
                        </ul>

                        <div style={{backgroundColor: 'var(--color-gray-50)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--color-warning)'}}>
                            <p style={{margin: 0, fontSize: '14px', color: 'var(--text-secondary)'}}>
                                <strong>Nota:</strong> Para información completa sobre términos y condiciones, 
                                políticas de privacidad y limitaciones de responsabilidad, consulte la documentación legal completa.
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn-modern btn-primary-modern" 
                        onClick={() => setShowLicenses(false)}
                    >
                        Entendido
                    </button>
                </Modal.Footer>
            </Modal>
        </AuroraPage>
    )
}

export default Profile