import { useAppSelector, useAppDispatch } from "../hooks"
import { useEffect, useState } from "react"
import {Stack, Modal, Form, Button } from "react-bootstrap"
import { loadSchemas, selectSchema } from "../Schema/schemaSlice"
import "./editor.css"
import "../profile.css"
import { loadPages,  selectPageAction,  deletePageAction, newSelectedPage, updatePageAction} from "./editorSlice"
import Field from "./Fields"
import {  iSchemaPage, iPage, iSchemaField } from "../types"
import { Tab, Tabs } from "react-bootstrap"
import { savePageAction } from "./editorSlice"
import Home from "../Pages/home"
import About from '../Pages/about'
import Product from "../Pages/product"
import Staff from "../Pages/staff"
import News from "../Pages/news"
import Web from "../Pages/web"
import Inicio from "../Pages/inicio"
import { SplitButton, Dropdown, Col, Row} from "react-bootstrap"
import AuroraPage from "../components/AuroraPage"

import PMAPagination from "../util/pmaPagination"
import PMASearch from "../util/pmaSearch"


function Editor(){     
    


const templates =useAppSelector((state)=>state.schema.pages )
const pages =useAppSelector((state)=>state.editor.pages )
const selectedPage = useAppSelector((state)=>state.editor.selectedPage)
const templateInfo = useAppSelector((state)=>state.schema.selectedPage)
const [showPreview, setShowPreview] = useState(false)
const [showConfirmDelete, setShowConfirmDelete] = useState(false)
const dispatch = useAppDispatch()
const loading = useAppSelector((state) => state.editor.loading)
const [filterName, setFilterName] = useState("")
const [filterTemplate, setFilterTemplate] = useState("xxx")
const [filterList, setFilterList] = useState("")
const [showContent, setShowContent] = useState(false)
const [editMode, setEditMode] = useState("")
const [num, setNum] = useState(1)

const [deletePage, setDeletePage] = useState<iPage | null>(null)
const block = 12
const [showDescription, setShowDescription] = useState(false)
const [showDetails, setShowDetails] = useState(false)

function filterPages(){
    let temp = pages
    if (filterTemplate !== ""){
        temp = pages.filter(i => i.Template === filterTemplate)
    }
    if (filterName!==""){
        temp = temp.filter(i=> i.Page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filterName.toLowerCase()))
    }
    return temp
}

function selectBlock(v: number){
    setNum(v)
}


async function clickOnCreatePage(){
           await  dispatch(selectSchema({page: filterTemplate}));
            let values: any[] = []
            components.map(i => values.push({name:i.name, component:i.component, value: emptyField(i)}))
            dispatch(newSelectedPage({Template: filterTemplate, Page:"", values:values}))
            setEditMode("adding");
            setShowContent(true)
    };

function emptyField(schema: iSchemaField){

    switch (schema.CType) {
        case "string":
          return {  text: schema.default ? schema.default :  ""}
        case "richtext":
            return {text: ""}     
        case "link":
            return {caption: schema.default ? schema.default : "", link:""}
        case "image":
            return {name: ""}     
        case "numberAttribute":
            return {value: schema.default ? schema.default:  ""}
        case "listComponents":
            return []
        case "memberOf":
            return []
        case "color":
            return {value:""}
        case "date":
            return {value: schema.default ? schema.default:  ""}
        case "selectAttribute":
            return {value: schema.default ? schema.default:  ""}
        default:
            return {value: schema.default ? schema.default:  null}
          
}
}










const components = useAppSelector((state)=> state.schema.components)


useEffect(()=> {dispatch(loadPages())},[])
useEffect(()=> {dispatch(loadSchemas())},[])


    return (
    <AuroraPage variant="wide">
        {/* Editor Header */}
        <div className="profile-header">
            <h1>Content Editor</h1>
            <p>Create, edit and manage your website content with our professional content management system</p>
        </div>
        
        <div className={ loading ? "editorFullSection sectionloading" :  "editorFullSection section"}  key="Page" >
      

             <Tabs onSelect={()=> {setFilterTemplate("xxx")}} className="editor-main-tabs">
                <Tab eventKey="Pages" title={
                  <span className="editor-tab-title">
                    <svg className="editor-tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Pages
                    <span className="editor-tab-count">{pages.filter(p => templates.some(t => t.CType === "page" && t.page === p.Template)).length}</span>
                  </span>
                }>  
                   
                    <div className="editorTabDiv">
                    <div className="editorMenuDiv"  >
                    
                    <PMASearch placeholder="Search..." value={filterList} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilterList(e.target.value)} ></PMASearch>
                    <div className="editorMenuTableWrapper">
                        
                            {[...templates.filter(i=> i.CType=="page" && i.page.includes(filterList))].sort((a,b)=> a.page.localeCompare(b.page)).map((item: iSchemaPage)=> 
                             <Row className="editorMenuRow">
                                <Col >
                             
                                { item.page != filterTemplate
                                 ?   
                                <button className="editor-template-button" onClick={()=>{setFilterTemplate(item.page); setNum(1) }}>
                                  <span className="editor-template-tag" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter(p => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </button> :
                                <div className="editor-template-button active">
                                  <span className="editor-template-tag active" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter(p => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </div>
                               
                                }   
                                
                                </Col>
                             </Row>
                            )} 
                          
                          </div>
                    </div>
                    <div className="editorListDiv"  >
                        
                        <Stack direction="horizontal" gap={3}>
                       
                        
                        <PMASearch onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)} value={filterName} ></PMASearch>
                    
                        <div className="ms-auto">
                           
                        <Button variant= "primary" size="sm"  onClick={clickOnCreatePage} disabled={filterTemplate==="xxx" || pages.filter(i=>  i.Template === filterTemplate).length >= (templates.find(i => i.page === filterTemplate)?.max ?? 0) }  className="modern-add-btn" style={{fontSize: '0.8rem', padding: '0.35rem 0.8rem'}}>
                          <i className="bi bi-plus-circle"></i>Add
                        </Button>
                        </div>
                        
                        </Stack>

                       
                        <div className="editorListTableWrapper">
                    
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-grid-3x3-gap me-1"></i>Type
                       </div>
                       <div className="editorListTableTd editorListTableTr editorListTableHead">
                         <i className="bi bi-file-earmark-text me-1"></i>Name
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-clock me-1"></i>Last update
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-person me-1"></i>Updated by
                       </div>
                       <div className="editorListTableTd editorListTableTr editorListTableHead">
                         <i className="bi bi-gear me-1"></i>Actions
                       </div>
                            
                           

         
                    {

                        [...filterPages()].sort((a,b)=> (a.Page).localeCompare( b.Page )).filter((_, index)=> index >= (num -1) * block && index < num * block  ).map((item) =>
  
    <>
          <div className="editorListTableTdExtra editorListTableTr"> 
            <span className="editor-template-tag" data-template={item.Template.toLowerCase()}>{item.Template}</span>
          </div> 
          <div className="editorListTableTd editorListTableTr">{item.Page}</div> <div className="editorListTableTdExtra editorListTableTr " > { item.updateTime?.substring(0,21)}</div><div className="editorListTableTdExtra editorListTableTr">{item.updateUser}</div>
         <div className="editorListTableTdActions editorListTableTr">
            <SplitButton
              variant="outline-primary"
              size="sm"
              title="Actions"
              id={`actions-dropdown-${item.Page}`}
              className="editor-actions-dropdown"
            >
              <Dropdown.Item 
                onClick={() => {
                  dispatch(selectPageAction(item.Page));
                  setShowPreview(true);
                }}
                disabled={selectedPage?.Page === ""}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Preview
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={async () => {
                  setEditMode("editing");
                  await dispatch(selectPageAction(item.Page));
                  setShowContent(true);
                  dispatch(selectSchema({page: item.Template}));
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => {
                  setShowConfirmDelete(true);
                  setDeletePage(item);
                }}
                className="text-danger"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Remove
              </Dropdown.Item>
            </SplitButton>
          </div>
                     
          <div className="editorListTableTdMobileActions ">
            <SplitButton
          variant="primary"
          size="sm"
          title="Action"
          id="segmented-button-dropdown-2"
          
        >
          <Dropdown.Item onClick={async ()=>{setEditMode("editing"); await dispatch(selectPageAction(item.Page)); setShowContent(true); dispatch(selectSchema({page:item.Template})) }}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={()=>{setShowConfirmDelete(true); setDeletePage(item)}}>Delete</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item  onClick={() => setShowPreview(true)}>View</Dropdown.Item>
        </SplitButton>
               </div>
               
               
          
    
   </>) }

                      
                        </div>
                        
                        <div style={{display:"flex", width:"100%" , justifyContent:"center"}}>
                      
                            <PMAPagination handleClick={selectBlock} number={num} block={block} numberOfItems={filterPages().length} ></PMAPagination>  </div>
     
                       

                    </div>
                    </div>
               
                </Tab>
                <Tab eventKey="Partial" title={
                  <span className="editor-tab-title">
                    <svg className="editor-tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Partial Content
                    <span className="editor-tab-count">{pages.filter(p => templates.some(t => t.CType === "partial" && t.page === p.Template)).length}</span>
                  </span>
                }>
                <div className="editorTabDiv">
                <div className="editorMenuDiv" >
                    
                    <PMASearch placeholder="Search..." value={filterList} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilterList(e.target.value)} ></PMASearch>
                    <div className="editorMenuTableWrapper">
                            {[...templates.filter(i=> i.CType=="partial" && i.page.includes(filterList))].sort((a,b)=> a.page.localeCompare(b.page)).map((item: iSchemaPage)=> 
                             <Row className="editorMenuRow " >
                                <Col >
                                
                                { item.page != filterTemplate
                                 ?   
                                <button className="editor-template-button" onClick={()=>{setFilterTemplate(item.page); setNum(1) }}>
                                  <span className="editor-template-tag" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter(p => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </button> :
                                <div className="editor-template-button active">
                                  <span className="editor-template-tag active" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter(p => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </div>
                                }   
                               
                                </Col>
                                
                                
                             </Row>
                            )} 
                         </div >
                       
                    </div>
                    <div className="editorListDiv">
                        
                        <Stack direction="horizontal" gap={3}>
                       
                        
                        <PMASearch onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)} value={filterName} ></PMASearch>
                    
                        <div className="ms-auto">
                        <Button variant="primary" size="sm"  onClick={clickOnCreatePage} disabled={filterTemplate==="xxx"} className="modern-add-btn" style={{fontSize: '0.8rem', padding: '0.35rem 0.8rem'}}>
                          <i className="bi bi-plus-circle"></i>Add
                        </Button>
                        </div>
                        
                        </Stack>
                        
                        <div className="editorListTableWrapper">
                      
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-grid-3x3-gap me-1"></i>Type
                       </div>
                       <div className="editorListTableTd editorListTableTr editorListTableHead">
                         <i className="bi bi-file-earmark-text me-1"></i>Name
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-clock me-1"></i>Last update
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-person me-1"></i>Updated by
                       </div>
                       <div className=".editorListTableTdActions editorListTableTr editorListTableHead">
                         <i className="bi bi-gear me-1"></i>Actions
                       </div>
            
                           

         
                    {

                        [...filterPages()].sort((a,b)=> (a.Page).localeCompare( b.Page )).filter((_, index)=> index >= (num -1) * block && index < num * block  ).map((item) =>
  
    <>
         <div className="editorListTableTdExtra editorListTableTr"> 
           <span className="editor-template-tag" data-template={item.Template.toLowerCase()}>{item.Template}</span>
         </div> 
          <div className="editorListTableTd editorListTableTr"  >{item.Page}</div> 
          <div className="editorListTableTdExtra editorListTableTr"> { item.updateTime?.substring(0,21)}</div>
          <div  className="editorListTableTdExtra editorListTableTr">{item.updateUser}</div>
          <div className="editorListTableTdActions editorListTableTr">
            <SplitButton
              variant="outline-primary"
              size="sm"
              title="Actions"
              id={`actions-dropdown-${item.Page}-2`}
              className="editor-actions-dropdown"
            >
              <Dropdown.Item 
                onClick={async () => {
                  setEditMode("editing");
                  await dispatch(selectPageAction(item.Page));
                  setShowContent(true);
                  dispatch(selectSchema({page: item.Template}));
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => {
                  setShowConfirmDelete(true);
                  setDeletePage(item);
                }}
                className="text-danger"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Remove
              </Dropdown.Item>
            </SplitButton>
          </div>
               
          <div className="editorListTableTdMobileActions editorListTableTr">
            <SplitButton
          variant="primary"
          size="sm"
          title="Action"
          id="segmented-button-dropdown-2"
          
        >
          <Dropdown.Item  onClick={async ()=>{setEditMode("editing"); await dispatch(selectPageAction(item.Page)); setShowContent(true); dispatch(selectSchema({page:item.Template})) }}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={()=>{setShowConfirmDelete(true); setDeletePage(item)}}>Delete</Dropdown.Item>
         
        </SplitButton>
               </div>
               
               
                 
          
    
   </>) }

                        </div>
                        <div className="editorListPagination">
                        
                            <PMAPagination handleClick={selectBlock} number={num} block={block} numberOfItems={filterPages().length} ></PMAPagination>  </div>
             
                       

                    </div>
                    </div>
                    
                   
                </Tab>
           </Tabs>


  </div>

 
  {
    ///**********************SHOW CONTENT *******************************/
  }
        
    <Modal show={showContent} onHide={()=>setShowContent(false)} fullscreen  >
  
        <Modal.Header closeButton className="modern-modal-header">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="modal-title-container">
              <h4 className="modal-title modern-modal-title mb-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Edit Content
              </h4>
              <small className="text-muted d-block">
                <i className="bi bi-file-earmark-text me-1"></i>
                {selectedPage?.Template} • {selectedPage?.Page}
              </small>
            </div>
            <div className="header-actions">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setShowPreview(true)} 
                disabled={selectedPage?.Page==""} 
                className="modern-btn-outline"
              >
                <i className="bi bi-eye-fill me-2"></i>
                Preview
              </Button>
            </div>
          </div>
        </Modal.Header>
      
    <Modal.Body className="modern-modal-body p-0">

        <div    style={{display:"flex" }} >
            <div className="editorInfoDiv" >
            
            <div className={showDescription ? "description" : "noDescription"} >
            <div>
            <button onClick={()=> {if(showDescription) setShowDescription(false); else setShowDescription(true)}} className="infoButton">&#9432;</button>
            <span hidden ={!showDescription} className="areaTitle" >Info</span>
            <hr style={{margin:"0px"}}></hr>
            </div>
            <div hidden ={!showDescription}>
            
         
            <div style={{padding:"10px"}}>
             <h5>{templateInfo.page}:</h5>
             <div dangerouslySetInnerHTML = {{__html: templateInfo.description}}></div>
             </div>
            </div>
            </div>
          
           
            
            
            </div>


            <div className="editorFormDiv"> 
    <Form id="pageForm" onSubmit={async (e) => {
          
              e.preventDefault();  
            const form = e.currentTarget;
            if (form.checkValidity() === false) {
                e.stopPropagation();}
            else { 
                if (editMode === "editing"){
                await dispatch(updatePageAction(selectedPage)); 
                }
                else{
                    await dispatch(savePageAction(selectedPage)); 
                }
                setShowContent(false); 
                await dispatch(loadPages());
                } }} >
        {
         [...components].filter((item)=> item.component == selectedPage?.Template + "/"+ item.name ).sort((a,b)=> a.order - b.order).map((item) =>
            <>
            <div> 
                <Field Schema={item} component={item.component} name={item.name} value={selectedPage?.values.find((v)=> v.component == item.component)?.value ??  emptyField(item)   }     editMode={editMode}   ></Field> 
            </div>
            <hr/>
            </>
            )
        }
      </Form>
            </div>


      <div className="editorDetailsDiv"  >
      

            <div className=  {showDetails ? "details" : "noDetails"}    >
               
             
                        
               <div style={{display:"flex", justifyContent:"right",  verticalAlign:"center"}}>         
       
     <div>
        <span className=" areaTitle"  hidden={!showDetails} > Details </span>
        <button onClick={()=>{if(showDetails) setShowDetails(false); else setShowDetails(true)  }} className="infoButton" style={{fontSize:"30px"
        
    }}>☰
    </button>
    </div>
        </div>
        <hr style={{margin:"0px"}}></hr>
        
        
        
        <div className="areaDiv" hidden={!showDetails}>

            <p className="sectionSide">
         <span className="sectionTitle">  Created </span>  <br/>
          <span className="label">Created by: </span> {selectedPage.creatorUser}<br/>
          <span className="label">Created on: </span> {selectedPage.createdTime}
          </p>

          <p className="sectionSide">
         <span className="sectionTitle">  Updated </span>  <br/>
          <span className="label">Updated by: </span> {selectedPage.updateUser}<br/>
          <span className="label">Update on: </span> {selectedPage.updateTime}
          </p>
       

          <p className="sectionSide">
         <span className="sectionTitle">  Version  </span>  <br/>
          <span className="label">Version: </span> 1.0<br/>
          </p>

          <p className="sectionSide">
         <span className="sectionTitle">  Approved </span>  <br/>
         <span className="label">Approved: </span> { selectedPage.updateUser ? "yes" : "no"}<br/>
          <span className="label">Approved by: </span> {selectedPage.updateUser}<br/>
          <span className="label">Approved on: </span> {selectedPage.updateTime}
          </p>
        
          <p className="sectionSide">
         <span className="sectionTitle">  Published </span>  <br/>
         <span className="label">Published: </span>{ selectedPage.updateUser ? "yes" : "no"}<br/>
          <span className="label">Updated by: </span> {selectedPage.updateUser}<br/>
          <span className="label">Update on: </span> {selectedPage.updateTime}
          </p>

          

        </div>
        
      
        </div>
       </div>
      </div>
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer">
          <div className="modal-footer-content">
            <div className="footer-info">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Changes will be saved to your content library
              </small>
            </div>
            <div className="footer-actions">
              <Button 
                onClick={() => setShowContent(false)} 
                variant="outline-secondary"
                className="modern-btn-outline me-2"
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                form="pageForm" 
                type="submit"
                className="modern-btn"
              >
                <i className="bi bi-check-lg me-2"></i>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Footer>
       
    </Modal>
   

    {
    //************** *********/

    //************** */
}


                <Modal show={showConfirmDelete} onHide={()=>setShowConfirmDelete(false)} centered>
                  <Modal.Header closeButton className="modern-modal-header modern-modal-danger">
                    <Modal.Title className="modern-modal-title">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 9l-6 6" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 9l6 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Delete Content
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="modern-modal-body">
                    <div className="confirmation-content">
                      <div className="confirmation-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-danger">
                          <path d="M3 6h18" stroke="currentColor" strokeWidth="2"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M10 11v6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M14 11v6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="confirmation-text">
                        <h6 className="mb-2">Are you sure you want to delete this content?</h6>
                        <p className="text-muted mb-3">
                          This action will permanently remove the selected page from your content library.
                        </p>
                        <div className="content-details">
                          <div className="detail-item">
                            <strong>Template:</strong> 
                            <span className="editor-template-tag ms-2" data-template={deletePage?.Template?.toLowerCase()}>
                              {deletePage?.Template}
                            </span>
                          </div>
                          <div className="detail-item">
                            <strong>Page:</strong> {deletePage?.Page}
                          </div>
                        </div>
                        <div className="alert alert-danger mt-3" role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          <small>This action cannot be undone.</small>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="modern-modal-footer">
                    <div className="modal-footer-content">
                      <div className="footer-actions w-100 justify-content-end">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowConfirmDelete(false)}
                          className="modern-btn-outline me-2"
                        >
                          <i className="bi bi-x-lg me-2"></i>
                          Cancel
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => {
                            if(deletePage?.Page) dispatch(deletePageAction({Page:deletePage.Page}));
                            setShowConfirmDelete(false);
                          }}
                          className="modern-btn modern-btn-danger"
                        >
                          <i className="bi bi-trash-fill me-2"></i>
                          Delete Content
                        </Button>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>


                <Modal show={showPreview} onHide={() => setShowPreview(false)} fullscreen={true}>
                  <Modal.Header closeButton className="modern-modal-header">
                    <Modal.Title className="modern-modal-title">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Content Preview
                      <span className="ms-2">
                        <span className="editor-template-tag" data-template={selectedPage?.Template?.toLowerCase()}>
                          {selectedPage?.Template}
                        </span>
                      </span>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="p-0 preview-container">
                        
                        { selectedPage?.Template=="Home" ? <Home></Home>:""}
                        { selectedPage?.Template=="About" ? <About></About>:""}
                        { selectedPage?.Template=="web" ? <Web></Web>:""}
                        { selectedPage?.Template=="Staff" ? <Staff></Staff>:""}
                        { selectedPage?.Template=="Products" ? <Product></Product>:""}
                        { selectedPage?.Template=="News" ? <News></News>:""}
                        { selectedPage?.Template=="Inicio" ? <Inicio></Inicio>:""}
                        
                    </Modal.Body>
                  
           
                </Modal>

    </AuroraPage>
    )
}

export default Editor