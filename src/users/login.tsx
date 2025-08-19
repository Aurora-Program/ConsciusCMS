// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn,  forgotPassword, confirmForgotPassword, firstLogin, provideSoftwareTokenLogin  } from './authService.js';
import { useAppDispatch, useAppSelector } from '../hooks.js';
import {acceptEulaAction, authenticate} from './userSlice.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import {Modal} from 'react-bootstrap'
import { configureStore } from '@reduxjs/toolkit';
import './login.css'
import { getSettingSecAction, editSettingSecAction } from '../Settings/settingsSlice.js';



function parseJwt (token : string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

const Login = () => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const url =  import.meta.env.VITE_CONTENT_BUCKET_URL

  const websiteName =  useAppSelector ((state) => state.settings.websiteName)
  const logo =  useAppSelector ((state) => state.settings.logo)
  const loginImage =  useAppSelector ((state) => state.settings.loginPicture)
  const eulaAccepted = useAppSelector((state)=> state.user.eulaAccepted)
  const [resetPasswordShow, setResetPasswordShow] = useState(false)
  const [tempForgotPassword, setTempForgotPassword] = useState("")
  const [mode, setMode] =useState("login")
  const [code, setCode] = useState ("")
  const [errorMessage, setErrorMessage]  = useState("")
  const [passwordResetedShow, setPasswordResetedShow] = useState(false)
  const [session, setSession] = useState("")
  const [licenseShow, setLicenseShow] = useState(false)
 
  function clearValues(){
    setPassword("");
    setConfirmPassword("");

  }
  const handleForgotPassword = async (e)=>
    
    {
      setPassword("");
        try {
          await forgotPassword(tempForgotPassword)
          setErrorMessage("")
          setMode("resetPassword"); 
          setResetPasswordShow(false);
          clearValues()
        }
      catch(error){
        setErrorMessage(error)
      }
    
    }

  const handleResetPasswordConfirmation = async (e) =>{
    e.preventDefault();
    

    if(password != confirmPassword ){
      
      setErrorMessage("*Password does not match")
      clearValues()
    }

    else{
      try {
   
        await confirmForgotPassword(tempForgotPassword, password, code)
        setErrorMessage("") 
   
        setPasswordResetedShow(true)
        clearValues()
      }
      catch(error){
        console.log(error.message)
        setErrorMessage(error.message)
      }

    }


  }

  const handleFirstLogin  = async (e) =>{


    e.preventDefault();

  


    if(password1 != confirmPassword ){
      
      setErrorMessage("*Password confirmation does not match")
     
    }

    else{

    e.preventDefault();

      try {
       
    

        await firstLogin(email, password1, session) 
        console.log("Eula Accepted")
        dispatch(acceptEulaAction(email))
        setErrorMessage("")
        setPasswordResetedShow(true)
        clearValues()

           
      }
      catch(error){
   
        setErrorMessage(error.message)
      }
    }

    }

  const handleSoftwareToken = async (e) =>

    {
      e.preventDefault();
      try {
        const res = await provideSoftwareTokenLogin(email, code, session )
        console.log(res)
        setErrorMessage("")
        if (res.AuthenticationResult && typeof res.AuthenticationResult.AccessToken !== 'undefined') {
          sessionStorage.setItem('accessToken', res.AuthenticationResult.AccessToken);
          if (sessionStorage.getItem('accessToken')) {
            const IdToken = parseJwt(sessionStorage["idToken"].toString())
            
            configureStore
  
            console.log(IdToken)
            dispatch(authenticate({"email": IdToken.email, "name":IdToken.name, "role": IdToken["cognito:groups"]}))
            navigate('/site/home');
            clearValues()

            

            
          }
      }
    }
      catch(error){
        setErrorMessage(error.message)
      }
    }

  const handleSignIn = async (e) =>  {
    e.preventDefault();
    e.stopPropagation();

    try {

      const res = await signIn(email, password);
      console.log(res);
      console.log('Sign in successful', session);
      setErrorMessage("")
      if (res.AuthenticationResult && typeof res.AuthenticationResult.AccessToken !== 'undefined') {


        sessionStorage.setItem('accessToken', res.AuthenticationResult.AccessToken);
        if (sessionStorage.getItem('accessToken')) {
          const IdToken = parseJwt(sessionStorage["idToken"].toString())
          
          configureStore

          console.log(IdToken)
          dispatch(authenticate({"email": IdToken.email, "name":IdToken.name, "role": IdToken["cognito:groups"]}))
          await dispatch(getSettingSecAction("Profile"))
          if (!eulaAccepted ){
            navigate('/site/home');
          }
          else{
            navigate('/site/home');
           }
        } else {
          console.error('Session token was not set properly.');
        }
      } else {

          switch (res.ChallengeName) {
          
            case "NEW_PASSWORD_REQUIRED": 

                   
              setMode("firstlogin")
              console.log(res.ChallengeParameters)
              setSession(res.Session)
           
              break;
            
            case "SOFTWARE_TOKEN_MFA":
              
            setMode("SMS")
            console.log(res.ChallengeParameters)
            setSession(res.Session)
              break;
                
              
          }
      }
    } 
    
    catch (error) {
      setErrorMessage(`Sign in failed: ${error}`);
    }
  };

 



  if (mode == "login") {

  return (
    <>
 
 <meta charSet="utf-8" />
                <title>ConscioCMS - Alvaro Laiz Website</title>
                <link rel="canonical" href="https://d2vp9tpwoisslx.cloudfront.net/login" />

                <meta property="og:title" content="Jorid Baron Login Page" />
                <meta property="og:description" content="ConscioCMS website editor Login page" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://d2vp9tpwoisslx.cloudfront.net/login" />
                <meta property="og:image" content="https://pma-demo1-content-paris.s3.eu-west-3.amazonaws.com/logo.png" />
        <div className='loginContainer'>
        <div className='colIzquierda'>
        <img src={url +"/" + loginImage}  className='loginImage'></img>
        
        </div>
        <div className='colDerecha'>
      
        <div className='loginBox'>
      
    
         
              <div className='loginHead'>
              <div className='loginLogoDiv'><img className='loginLogoImage' src={url +"/" + logo}  ></img></div>
              <div className='loginTitleDiv'>
                <h3><i className="bi bi-shield-lock me-2"></i>{websiteName}</h3>
              </div>
              </div>
          
           <div className='loginTextP'>
            <p>
            <span><i className="bi bi-person-circle me-2"></i>Bienvenido</span><br></br>
            <span className="login-subtitle">Accede a tu cuenta para continuar</span>
            </p>
            </div>
            <div className="loginForm">

      <Form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
   
        <div className="formLogin" >
        <div className="loginControls">
          <div className="modern-input-group">
            <i className="bi bi-envelope input-icon"></i>
            <Form.Control
              className='loginInputText modern-input'
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>
          
          <div className="modern-input-group">
            <i className="bi bi-lock input-icon"></i>
            <Form.Control
              className='loginInputText modern-input'
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
      
        <Button className='loginInputBotton modern-login-btn' variant="primary" type="submit">
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Button>
        </div>
       
        
        </div>
        <div className='loginErrorDiv'>
          
          <p className='loginErrorP'> {errorMessage}</p>
        </div>
       <div  >
      <div >
      <div className='loginForgotDiv' onClick={ ()=> {setErrorMessage("");setResetPasswordShow(true)}}>  
        <p className='loginForgotP'>
          <i className="bi bi-question-circle me-1"></i>
          ¿Olvidaste tu contraseña?
        </p>
      </div>
      </div>
      </div>

      </Form>
      
      </div>
    
   
     
     
      </div>
     
        </div>
        
        </div>

          <Modal show={resetPasswordShow} onHide={()=>setResetPasswordShow(false)} centered>
                     <Modal.Header closeButton className="modern-modal-header">
                      <Modal.Title>
                        <i className="bi bi-key-fill me-2"></i>
                        Reset Password
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modern-modal-body">
                      <div className="text-center mb-3">
                        <i className="bi bi-envelope-at-fill text-primary fs-1"></i>
                      </div>
                      <p className="text-center">
                        Ingresa tu correo electrónico. Si es correcto, recibirás un email con instrucciones para cambiar tu contraseña.
                      </p>
                      <Form.Label>
                        <i className="bi bi-envelope me-2"></i>
                        Dirección de e-mail:
                      </Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <Form.Control 
                          type="email" 
                          placeholder="ejemplo@correo.com"
                          onChange={(e)=>setTempForgotPassword(e.target.value)} 
                          value={tempForgotPassword}
                          className="modern-input"
                        />
                      </div>
                      {errorMessage && (
                        <div className="alert alert-danger mt-3" role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {errorMessage}
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer className="modern-modal-footer">
                      <Button variant="outline-secondary" onClick={()=>setResetPasswordShow(false)}>
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                      </Button>
                      <Button variant='primary' onClick={handleForgotPassword} className="modern-btn">
                        <i className="bi bi-send-fill me-2"></i>
                        Restablecer la contraseña
                      </Button>
                    </Modal.Footer>
                </Modal>


               
    
    </>
  );
}

else {

  return( 
  <>

<div className='loginContainer'>
        <div className='colIzquierda'>
        <img src={url +"/" + loginImage}  className='loginImage'></img>
        
        </div>
        <div className='colDerecha'>
      
        <div className='loginBox'>
      
    
         
              <div className='loginHead'>
              <div className='loginLogoDiv'><img className='loginLogoImage' src={url +"/" + logo}  ></img></div>
              <div className='loginTitleDiv'><h3>{websiteName}</h3></div>
              </div>
          
           <div className='loginTextP'>
            <p>
            {
            mode=="SMS" ? <span>Codigo del segundo factor de authenticacion</span> :
            
            mode == "resetPassword" ?

            
<span>Establece una nueva contraseña y acepta las condiciones de la licencia</span>: 
<>
  <span>Cambia tu contraseña temporal por una permanente y acepta los términos de la licencia</span> 
  <button className='buttonSelectPage' onClick={() => setLicenseShow(true)}>
    Haz clic aquí
  </button> 
  para leer todos los detalles de las condiciones del EULA. Al cambiar tu contraseña, aceptas las condiciones del EULA para el servicio de gestión de contenido.
</>}</p>

          
            </div>
            <div className="loginForm">


           
           

      <Form  onSubmit={mode == "SMS" ? handleSoftwareToken : mode == "resetPassword" ? handleResetPasswordConfirmation : handleFirstLogin}>
      <div className="formLogin" >
        <div className="loginControls">

        {mode== "SMS" ? 
         <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-phone-fill"></i>
          </span>
          <Form.Control
            className="loginInputText modern-input"
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código SMS"
            required
          /> 
        </div>
        
          :


         mode == "resetPassword" ? 
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-key-fill"></i>
          </span>
          <Form.Control
            className="loginInputText modern-input"
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de verificación"
            required
          /> 
        </div>
         : ""
      }
 

 {mode== "SMS" ? "" :
<>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <Form.Control
            className="loginInputText modern-input"
            id="password"
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="Nueva contraseña"
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-shield-lock-fill"></i>
          </span>
          <Form.Control
            className="loginInputText modern-input"
            id="confirPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            required
          />
        </div>
</>
}
        
       
              
        <Button variant="primary" type="submit" className='loginInputBotton modern-btn'>
          {mode=="SMS" ? 
            <><i className="bi bi-shield-check me-2"></i>Autenticar</> : 
            mode == "resetPassword" ? 
            <><i className="bi bi-key-fill me-2"></i>Cambiar Contraseña</> : 
            <><i className="bi bi-lock-fill me-2"></i>Establecer Contraseña y Aceptar EULA</>
          }
        </Button>
       
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMessage}
          </div>
        )}

       
       <div style={{display:"flex", width:"100%", justifyContent:"center"}} >
      <div style={{width:"200px"}}>



    
      </div>
      </div>

        </div>
        </div>
      </Form>
      
      </div>
    
   
     
     
      </div>
     
        </div>
        
          </div>
          <Modal show={passwordResetedShow} onHide={()=>{ setMode("login")  ;setPasswordResetedShow(false)}} centered>
                     <Modal.Header closeButton className="modern-modal-header bg-success text-white">
                      <Modal.Title>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        La contraseña se cambió correctamente
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modern-modal-body">
                      <div className="text-center mb-3">
                        <i className="bi bi-shield-check text-success" style={{fontSize: '4rem'}}></i>
                      </div>
                      <p className="text-center">
                        La contraseña se cambió correctamente, haz click en OK y haz login con tu nueva contraseña.
                      </p>
                    </Modal.Body>
                    <Modal.Footer className="modern-modal-footer">
                    <Button variant='success' onClick={()=>{setMode("login"); setPasswordResetedShow(false) }} className="modern-btn">
                       <i className="bi bi-check-lg me-2"></i>
                       OK
                     </Button>
                  </Modal.Footer>
                </Modal>

               


                <Modal show={licenseShow} onHide={()=>{  setLicenseShow(false)}} size="xl" centered>
                     <Modal.Header closeButton className="modern-modal-header">
                      <Modal.Title>
                        <i className="bi bi-file-text-fill me-2"></i>
                        EULA - Términos y Condiciones
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                               
                    <h5>TÉRMINOS Y CONDICIONES DE USO  </h5>

<p>
Esta página web es propiedad y está operado por licenciatario. 
Estos Términos establecen los términos y condiciones bajo los cuales puedes usar nuestra 
página web y nuestros servicios. Esta página web ofrece a los visitantes un porfolio profesional.
Al acceder o usar la página web, aceptas haber leído, entendido y 
aceptado estar sujeto a estos Términos:</p> <p>
INFORMACIÓN RELEVANTE </p>
<p>
Para el uso de este servicio es necesario el registro por parte del usuario, 
con ingreso de datos personales fidedignos y definición de una contraseña. El usuario puede 
elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier 
momento, en caso de que se haya registrado y que sea necesario para la uso de 
nuestros servicios. El provedor del servicio no asume la responsabilidad en caso de que el titular de la pagina web 
entregue dicha clave a terceros. 
</p><p>
Todas las transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un 
proceso de confirmación y verificación, el cual podría incluir la validación de la forma de 
pago, validación de la factura (en caso de existir) y el cumplimiento de las condiciones 
requeridas por el medio de pago seleccionado. En algunos casos puede que se requiera una 
verificación por medio de correo electrónico. 
Los precios de los servicios ofrecidos en esta web son válidos solamente en las suscripciones 
realizadas en este sitio web. </p>
<p> LICENCIA </p><p>
e-fabrica a través de su sitio web concede una licencia para que los 
usuarios utilicen los servicios que son vendidos en este sitio web de acuerdo a los Términos 
y Condiciones que se describen en este documento y la licencia que se describe en el aparatdo Licencia contratada de este contrato. </p>
<p>
USO NO AUTORIZADO </p>
<p>
Usted no puede copiar, vender o utilizar el codigo de este producto, fuera de otros fines que sean diferentes al objecto de esta licencia
Este servicio solo se podra se usado con con los fines descritos en esta licencia.
Los recursos usados por la pagina web y su content managment no podran superar los limites que establece esta licencia.

</p><p>
PROPIEDAD </p><p>
Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, 
modificado o sin modificar. Todos los productos son propiedad de los proveedores del 
contenido. </p><p>
POLÍTICA DE REEMBOLSO Y GARANTÍA </p><p>
Al tratarse de una suscripción a un producto no tangible, no realizamos reembolsos después 
de realizar el pago, usted tiene la responsabilidad de entender las características antes de 
comprarlo. Le pedimos que lea cuidadosamente la descripción antes de comprarlo. Solo se 
hacen excepciones de esta regla cuando la descripción no se ajusta al servicio. 
Recuerde que puede ejercer su derecho de desistimiento en un plazo de 14 días naturales, a 
contar desde la suscripción al servicio.</p><p>
DERECHO A SUSPENDER O CANCELAR LA CUENTA DEL USUARIO </p><p>
Podemos terminar o suspender de manera permanente o temporal su acceso al servicio sin 
previo aviso y responsabilidad por cualquier razón, incluso si a nuestra sola determinación 
consideramos que ha violado alguna disposición de estos Términos y Condiciones o 
cualquier ley o regulación aplicable. </p><p>
Puede descontinuar el uso y solicitar la cancelación de su cuenta y/o cualquier servicio en 
cualquier momento. Sin perjuicio de lo dicho, con respecto a las suscripciones renovadas 
automáticamente, dichas suscripciones se suspenderán solo al vencimiento del período 
correspondiente por el que ya has realizado el pago. </p><p>
LIMITACIÓN DE RESPONSABILIDAD</p> <p>
En lo que permite la ley aplicable, en ningún caso [el titular de la página web] será 
responsable por daños indirectos, punitivos, incidentales, especiales, consecuentes o 
ejemplares, incluidos, entre otros, daños por pérdida de beneficios, buena voluntad, uso, 
datos u otras pérdidas intangibles, que surjan de o estén relacionadas con el uso o la 
imposibilidad de utilizar el servicio. 
En lo permitido por la ley aplicable, [el titular la página web] no asume responsabilidad 
alguna por (i) errores, errores o inexactitudes de contenido; (ii) lesiones personales o daños a 
la propiedad, de cualquier naturaleza que sean, como resultado de su acceso o uso de 
nuestro servicio; y (iii) cualquier acceso no autorizado o uso de nuestros servidores y/o toda 
la información personal almacenada en los mismos.</p> <p>
DERECHO A MODIFICAR LOS TÉRMINOS Y CONDICIONES DE USO </p>
<p>
Nos reservamos el derecho de modificar estos términos a nuestra entera discreción. Por lo 
tanto, debe revisar estas páginas periódicamente. Cuando cambiemos los Términos y 
Condiciones de una manera material, le notificaremos que se han realizado cambios 
importantes en los mismos a través de la dirección de email facilitada, con un plazo de 
antelación de un mes antes de la entrada en efecto de los nuevos Términos y Condiciones. El 
uso continuado de la página web o nuestro servicio después de dicho cambio constituye su 
aceptación de los nuevos Términos y Condiciones. Si no acepta alguno de estos términos o 
cualquier versión futura de los Términos y Condiciones, no use o acceda (o continúe 
accediendo) a la página web o al servicio. 
</p><p>
LEGISLACIÓN Y RESOLUCIÓN DE DISPUTAS </p><p>
Estos Términos y Condiciones, los derechos y recursos provistos aquí, y todos y cada una de 
las reclamaciones y disputas relacionados con este y/o los servicios, se regirán, 
interpretarán y aplicarán en todos los aspectos única y exclusivamente de conformidad con 
las leyes internas de Espana. Todas las reclamaciones y disputas se presentarán y 
usted acepta que sean decididos por un tribunal de jurisdicción competente ubicada en 
Madrid. </p><p>
PRIVACIDAD </p>
<p>
El titular de la página web garantiza que la información personal que usted envía cuenta 
con la seguridad necesaria. Los datos ingresados por el usuario o en el caso de requerir una 
validación de los pedidos no serán entregados a terceros, salvo que deba ser revelada en 
cumplimiento a una orden judicial o requerimientos legales. 
La suscripción a boletines de correos electrónicos publicitarios es voluntaria y podría ser 
seleccionada al momento de crear su cuenta. 
</p>
<h5>
LICENCIA CONTRATADA:
</h5>
<p>
2024@ConscioCMS web desing contementat management es un servicio de alojamiento y manojod de contenido para paginas web
Este servicio solo podrá ser utilizo con este fin y con las limitaciones que se describen ene esta licencia.
</p>
<p>
Usted a contratdo un licencia Basic de contenido.  Con las siguientes restricciones de contenido coste in contendio.
El precio de servicio son 6 euros al mes has Enero de 2025. Que deberán contratod por periodo anual y abonodos cuando se reelice el contrato. De forma promocional en caso de que la pagina halla sido disenada por enfocque, el coste del prime ano será gratuito.
Las condiciones de la licencia de 
</p>
<ul>
<li>	El contenido máximo almacenamiento por esta licenciasa son 300 Mb por la cantidad todoal de contenido. </li>
<li>	El máximo de visitas para este nivel de licencia será de 1000 visiatas al mes. Se estima como visita el acceso de un usuario en la que el sitio web es descargado.</li>
<li>	Esta licencia solo permite Access a un único usuario para manegar y editar el contenido de la wesbite desde el content management</li>
<li>	El soperte de esta licencia se limitara a manter la pagina web operatva, por lo tanto no incluiera cambios de diseño o supported technico de edición de la website.</li>
<li>Este servicio se provee usando infrastrucutre de Amazon Web Service. e-fabrica no se hace responsable de los fallos technicos de Amazon Web Service. </li>
<li>	En caso de que el servcicio pyknows web design content management sea cancelado e-fabrica transferirá la cuenta de amazon al usuario que se hará responsable del mantenimiento y coste de la cuenta. La website será completamente operativa pero el manejo del contendio se deberá realizar utilizando exclusivamente las herramientas nativas de AWS.</li>
<li>	Durante la valided de este contraro el usuario solo podrá editar el contenido usundao la herramienta  pynknos para manager el contenido.</li>
<li>	En caso de que el usuario exceda los limites de esta licencia o falle en realizar el pago del servicio e-fabrica notificara via email al usuario dicho discrepancia. En caso de que el beneficiario del servicio no resuelva el incidiente en el plazo de una semana la licencia la pagina web seara suspendido.</li>
</ul>
               
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant='primary' onClick={()=>{ setLicenseShow(false) }}>
                       Cerrar
                    </Button>

                    
                  </Modal.Footer>
                </Modal>



         
    
    </>
  )

}
};

export default Login;


