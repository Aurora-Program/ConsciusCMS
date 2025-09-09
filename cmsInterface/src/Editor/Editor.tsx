import { useAppSelector, useAppDispatch } from "../hooks"
import { useEffect, useState } from "react"
import {Stack, Modal, Form, Button } from "react-bootstrap"
import { useT } from "../util/useTranslation"
import { loadSchemas, selectSchema } from "../Schema/schemaSlice"
import "./editor.css"
import "../profile.css"
import { loadPages,  selectPageAction,  newSelectedPage } from "./editorSlice"
import Field from "./Fields"
import {  iSchemaPage, iPage, iSchemaField, iPageValue } from "../types"
import { Tab, Tabs } from "react-bootstrap"
// Use Redux thunks for ethics-token flow
import { requestPublishIntentAction, publishPageWithTokenAction, publishDeleteWithTokenAction } from "./editorSlice"
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
    
const t = useT()


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
const [showWarningInfo, setShowWarningInfo] = useState(false)
const [showSaveConfirm, setShowSaveConfirm] = useState(false)
const [showPublishModal, setShowPublishModal] = useState(false)
const [publishMessage, setPublishMessage] = useState<string | null>(null)
const [publishToken, setPublishToken] = useState<string | null>(null)
const [publishAction, setPublishAction] = useState<'save'|'delete'|'none'>('none')

// Token is now requested only on Save button click to avoid duplicate requests

function filterPages(){
  let temp = pages
  if (filterTemplate !== ""){
    temp = pages.filter((i: iPage) => i.Template === filterTemplate)
  }
  if (filterName!==""){
    temp = temp.filter((i: iPage)=> i.Page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filterName.toLowerCase()))
  }
  return temp
}

function selectBlock(v: number){
    setNum(v)
}

async function clickOnCreatePage(){
  if (filterTemplate === "xxx") return;
  // ensure schema for template is loaded first
  await dispatch(selectSchema({ page: filterTemplate }));
  // build initial values from the loaded components for this template
  const values = components
    .filter((item: iSchemaField) => item.component?.startsWith(filterTemplate + "/"))
    .sort((a: iSchemaField,b: iSchemaField)=> (a.order ?? 0) - (b.order ?? 0))
    .map((item: iSchemaField) => ({ component: item.component, value: emptyField(item) }));
  dispatch(newSelectedPage({Template: filterTemplate, Page:"", values:values}));
  setEditMode("adding");
  setShowContent(true);
}

function emptyField(schema: iSchemaField){
  switch (schema.CType) {
    case "image":
      return {name: ""};
    case "numberAttribute":
      return {value: schema.default ? schema.default:  ""};
    case "listComponents":
      return [];
    case "memberOf":
      return [];
    case "color":
      return {value:""};
    case "date":
      return {value: schema.default ? schema.default:  ""};
    case "selectAttribute":
      return {value: schema.default ? schema.default:  ""};
    default:
      return {value: schema.default ? schema.default:  null};
  }
}










const components = useAppSelector((state)=> state.schema.components)
// fields that match the currently selected page template
const matchedFields = (components && selectedPage && selectedPage.Template)
  ? components.filter((item: iSchemaField) => item.component === `${selectedPage.Template}/${item.name}`)
  : []


useEffect(()=> {dispatch(loadPages())},[])
useEffect(()=> {dispatch(loadSchemas())},[])

    return (


// Editor

    <AuroraPage variant="wide">
        {/* Editor Header */}
    <div className="profile-header">
      <h1>{t('editor.headerTitle')}</h1>
      <p>{t('editor.headerSubtitle')}</p>
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
                    {t('editor.tabPages')}
                    <span className="editor-tab-count">{pages.filter((p: iPage) => templates.some((t: iSchemaPage) => t.CType === "page" && t.page === p.Template)).length}</span>
                  </span>
                }>  
                   
                    <div className="editorTabDiv">
                    <div className="editorMenuDiv"  >
                    
                    <PMASearch placeholder={t('editor.searchPlaceholder')} value={filterList} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilterList(e.target.value)} ></PMASearch>
                    <div className="editorMenuTableWrapper">
                        
                            {[...templates.filter((i: iSchemaPage)=> i.CType=="page" && i.page.includes(filterList))].sort((a: iSchemaPage,b: iSchemaPage)=> a.page.localeCompare(b.page)).map((item: iSchemaPage)=> 
                             <Row className="editorMenuRow">
                                <Col >
                             
                                { item.page != filterTemplate
                                 ?   
                                <button className="editor-template-button" onClick={()=>{setFilterTemplate(item.page); setNum(1) }}>
                                  <span className="editor-template-tag" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter((p: iPage) => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </button> :
                                <div className="editor-template-button active">
                                  <span className="editor-template-tag active" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter((p: iPage) => p.Template === item.page).length}/{item.max || '∞'}</span>
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
                           
                        <Button variant= "primary" size="sm"  onClick={clickOnCreatePage} disabled={filterTemplate==="xxx" || pages.filter((i: iPage)=>  i.Template === filterTemplate).length >= (templates.find((i: iSchemaPage) => i.page === filterTemplate)?.max ?? 0) }  className="modern-add-btn" style={{fontSize: '0.8rem', padding: '0.35rem 0.8rem'}}>
                          <i className="bi bi-plus-circle"></i>{t('editor.addButton')}
                        </Button>
                        </div>
                        
                        </Stack>

                       
                        <div className="editorListTableWrapper">
                    
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-grid-3x3-gap me-1"></i>{t('editor.typeLabel')}
                       </div>
                       <div className="editorListTableTd editorListTableTr editorListTableHead">
                         <i className="bi bi-file-earmark-text me-1"></i>{t('editor.nameLabel')}
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-clock me-1"></i>{t('editor.lastUpdate')}
                       </div>
                       <div className="editorListTableTdExtra editorListTableTr editorListTableHead">
                         <i className="bi bi-person me-1"></i>{t('editor.updatedBy')}
                       </div>
                       <div className="editorListTableTd editorListTableTr editorListTableHead">
                         <i className="bi bi-gear me-1"></i>{t('editor.actionsLabel')}
                       </div>
                            
                           

         
                    {

                        [...filterPages()].sort((a: iPage,b: iPage)=> (a.Page).localeCompare( b.Page )).filter((_: any, index: number)=> index >= (num -1) * block && index < num * block  ).map((item: iPage) =>
  
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
                  // load schema first, then select page to avoid race
                  await dispatch(selectSchema({page: item.Template}));
                  await dispatch(selectPageAction(item.Page));
                  setShowContent(true);
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
          <Dropdown.Item onClick={async ()=>{setEditMode("editing"); await dispatch(selectSchema({page:item.Template})); await dispatch(selectPageAction(item.Page)); setShowContent(true); }}>Edit</Dropdown.Item>
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
                    <span className="editor-tab-count">{pages.filter((p: iPage) => templates.some((t: iSchemaPage) => t.CType === "partial" && t.page === p.Template)).length}</span>
                  </span>
                }>
                <div className="editorTabDiv">
                <div className="editorMenuDiv" >
                    
                    <PMASearch placeholder="Search..." value={filterList} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilterList(e.target.value)} ></PMASearch>
                    <div className="editorMenuTableWrapper">
                            {[...templates.filter((i: iSchemaPage)=> i.CType=="partial" && i.page.includes(filterList))].sort((a: iSchemaPage,b: iSchemaPage)=> a.page.localeCompare(b.page)).map((item: iSchemaPage)=> 
                             <Row className="editorMenuRow " >
                                <Col >
                                
                                { item.page != filterTemplate
                                 ?   
                                <button className="editor-template-button" onClick={()=>{setFilterTemplate(item.page); setNum(1) }}>
                                  <span className="editor-template-tag" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter((p: iPage) => p.Template === item.page).length}/{item.max || '∞'}</span>
                                </button> :
                                <div className="editor-template-button active">
                                  <span className="editor-template-tag active" data-template={item.page.toLowerCase()}>{item.page}</span>
                                  <span className="editor-template-count">{pages.filter((p: iPage) => p.Template === item.page).length}/{item.max || '∞'}</span>
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

                        [...filterPages()].sort((a: iPage,b: iPage)=> (a.Page).localeCompare( b.Page )).filter((_: any, index: number)=> index >= (num -1) * block && index < num * block  ).map((item: iPage) =>
  
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
                  await dispatch(selectSchema({page: item.Template}));
                  await dispatch(selectPageAction(item.Page));
                  setShowContent(true);
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
          <Dropdown.Item  onClick={async ()=>{setEditMode("editing"); await dispatch(selectSchema({page:item.Template})); await dispatch(selectPageAction(item.Page)); setShowContent(true); }}>Edit</Dropdown.Item>
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
                {editMode === "adding" ? t('editor.addingNew') : t('editor.editing')} {selectedPage?.Page || ''}
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

      
  <Modal.Body >

        <div style={{display:"flex"}}>
          {/* INFO SIDE PANEL */}
          <aside 
            className={`editorInfoDiv editor-side-panel ${showDescription ? 'expanded' : 'collapsed'} info-theme`} 
            aria-label="Información de la plantilla"
          >
            <div className="panel-inner">
              <div className="panel-header">
                <button
                  type="button"
                  aria-expanded={showDescription}
                  aria-controls="panel-info-body"
                  className="panel-toggle-btn"
                  onClick={() => setShowDescription(v => !v)}
                  title={showDescription ? t('editor.hideInfo') || 'Ocultar info' : t('editor.showInfo') || 'Mostrar info'}
                >
                  <span className="icon" aria-hidden="true">ℹ️</span>
                  <span className="panel-title">Info</span>
                  <span className="chevron" aria-hidden="true" />
                </button>
              </div>
              <div 
                id="panel-info-body" 
                className="panel-body" 
                hidden={!showDescription}
              >
                <h5 className="panel-heading-text mb-2">{templateInfo.page}</h5>
                <div className="panel-scroll" dangerouslySetInnerHTML={{__html: templateInfo.description}} />
              </div>
            </div>
          </aside>

          {/* FORM MAIN CONTENT */}
          <div className="editorFormDiv">
  <Form id="pageForm" onSubmit={async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
      } else {
        // Enforce two-step ethics flow: open confirm modal instead of direct save
        setShowSaveConfirm(true);
      }
  }}>
    {
      // show a loading message if there are no matching fields or no selected page yet
      // render the form when matchedFields are present and a selectedPage exists (covers both add and edit flows)
      (matchedFields.length === 0 || !selectedPage)
        ? <div>Loading fields...</div>
        : (
          matchedFields
            .sort((a: iSchemaField,b: iSchemaField)=> (a.order ?? 0) - (b.order ?? 0))
            .map((item: iSchemaField) => (
              <div key={item.component}>
                <Field Schema={item} component={item.component} name={item.name} value={selectedPage?.values?.find((v: iPageValue)=> v.component === item.component)?.value ??  emptyField(item) } editMode={editMode} />
                <hr/>
              </div>
            ))
        )
    }
    </Form>
            </div>


      <div className="editorDetailsDiv">
        <aside 
          className={`editor-side-panel ${showDetails ? 'expanded' : 'collapsed'} details-theme`} 
          aria-label="Detalles de la página"
        >
          <div className="panel-inner">
            <div className="panel-header">
              <button
                type="button"
                aria-expanded={showDetails}
                aria-controls="panel-details-body"
                className="panel-toggle-btn"
                onClick={() => setShowDetails(v => !v)}
                title={showDetails ? t('editor.hideDetails') || 'Ocultar detalles' : t('editor.showDetails') || 'Mostrar detalles'}
              >
                <span className="icon" aria-hidden="true">🧾</span>
                <span className="panel-title">Details</span>
                <span className="chevron" aria-hidden="true" />
              </button>
            </div>
            <div 
              id="panel-details-body" 
              className="panel-body" 
              hidden={!showDetails}
            >
              <div className="panel-stats-group">
                <div className="stat-block">
                  <div className="stat-title">{t('editor.updated')}</div>
                  <div className="stat-line"><strong>{t('editor.updatedBy')}:</strong> {selectedPage.updateUser || '-'}</div>
                  <div className="stat-line"><strong>{t('editor.updatedOn')}:</strong> {selectedPage.updateTime || '-'}</div>
                </div>
                <div className="stat-block">
                  <div className="stat-title">{t('editor.version')}</div>
                  <div className="stat-line"><strong>{t('editor.versionLabel')}:</strong> 1.0</div>
                </div>
                <div className="stat-block">
                  <div className="stat-title">{t('editor.approved')}</div>
                  <div className="stat-line"><strong>{t('editor.approvedLabel')}:</strong> {selectedPage.updateUser ? 'yes' : 'no'}</div>
                  <div className="stat-line"><strong>{t('editor.approvedBy')}:</strong> {selectedPage.updateUser || '-'}</div>
                  <div className="stat-line"><strong>{t('editor.approvedOn')}:</strong> {selectedPage.updateTime || '-'}</div>
                </div>
                <div className="stat-block">
                  <div className="stat-title">{t('editor.published')}</div>
                  <div className="stat-line"><strong>{t('editor.publishedLabel')}:</strong> {selectedPage.updateUser ? 'yes' : 'no'}</div>
                  <div className="stat-line"><strong>{t('editor.updatedBy')}:</strong> {selectedPage.updateUser || '-'}</div>
                  <div className="stat-line"><strong>{t('editor.updatedOn')}:</strong> {selectedPage.updateTime || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      </div>
        </Modal.Body>
      
      
        <Modal.Footer className="modern-modal-footer">
          <div className="modal-footer-content">
            <div className="footer-info">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                {t('editor.changesWillBeSaved')}
              </small>
            </div>
            <div className="footer-actions">
              <Button 
                onClick={() => setShowContent(false)} 
                variant="outline-secondary"
                className="modern-btn-outline me-2"
              >
                <i className="bi bi-x-lg me-2"></i>
                {t('editor.cancel')}
              </Button>
              <Button 
                variant="primary" 
                type="button"
                onClick={async () => {
                  try{
                    const payload = selectedPage;
                    const purpose = (editMode === 'editing' ? 'update-page' : 'save-page');
                    const action = await dispatch(requestPublishIntentAction({ content: payload, purpose }));
                    if ((action as any).error) {
                      console.error('requestPublishIntentAction (save button) rejected', (action as any).error);
                      throw new Error('intent_failed');
                    }
                    const res: any = (action as any).payload;
                    const token = res?.token || (res?.raw && res.raw.headers && (res.raw.headers['x-selfreview-token'] || res.raw.headers['X-SelfReview-Token']));
                    const message = (res?.hints && (res.hints.message?.es || res.hints.message?.en)) || (res?.raw && res.raw.headers && (res.raw.headers['x-selfreview-es'] || res.raw.headers['x-selfreview-en']));
                    setPublishToken(token || null);
                    setPublishMessage(message || null);
                    setPublishAction('save');
                  }catch(err:any){
                    console.error('requestPublishIntent (save button) failed', err);
                  } finally {
                    setShowSaveConfirm(true);
                  }
                }}
                className="modern-btn"
              >
                <i className="bi bi-check-lg me-2"></i>
                {t('editor.saveChanges')}
              </Button>
            </div>
          </div>
        </Modal.Footer>
       
    </Modal>

            <Modal show={showPublishModal} onHide={() => setShowPublishModal(false)} centered>
              <Modal.Header closeButton className="modern-modal-header">
                <Modal.Title className="modern-modal-title">{t('editor.previewButton')}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modern-modal-body">
                <div>
                  <p>{publishMessage || t('editor.warningBody')}</p>
                  <p className="text-muted">{t('editor.changesWillBeSaved')}</p>
                </div>
              </Modal.Body>
              <Modal.Footer className="modern-modal-footer">
                <div className="modal-footer-content">
                  <div className="footer-actions w-100 justify-content-end">
                    <Button variant="outline-secondary" onClick={() => setShowPublishModal(false)} className="modern-btn-outline me-2">{t('editor.cancel')}</Button>
                    <Button variant="primary" className="modern-btn" onClick={async () => {
                      try{
                        if (!publishToken){
                          throw new Error('Missing publish token');
                        }
                        if (publishAction === 'save'){
                          await dispatch(publishPageWithTokenAction({ content: selectedPage, token: publishToken, method: (editMode === 'editing' ? 'PUT' : 'POST') }));
                        } else if (publishAction === 'delete'){
                          await dispatch(publishDeleteWithTokenAction({ content: deletePage, token: publishToken }));
                        }
                        setShowPublishModal(false);
                        setShowContent(false);
                        setPublishAction('none');
                        await dispatch(loadPages());
                      }catch(err:any){
                        console.error('publish action failed', err);
                        // Handle well-known token errors returned by publishPage
                        const code = err && err.message ? err.message : '';
                        if (code === 'token_expired'){
                          // Try to obtain a fresh intent token and keep the publish modal open
                          try{
                            const payload = publishAction === 'save' ? selectedPage : deletePage;
                            const purpose = publishAction === 'delete' ? 'delete-page' : (editMode === 'editing' ? 'update-page' : 'save-page');
                            const action = await dispatch(requestPublishIntentAction({ content: payload, purpose }));
                            const res: any = (action as any).payload;
                            const token = res.token || (res.raw && res.raw.headers && (res.raw.headers['x-selfreview-token'] || res.raw.headers['X-SelfReview-Token']));
                            const message = (res.hints && (res.hints.message?.es || res.hints.message?.en)) || (res.raw && res.raw.headers && (res.raw.headers['x-selfreview-es'] || res.raw.headers['x-selfreview-en']));
                            setPublishToken(token || null);
                            setPublishMessage(message || null);
                            // keep publish modal open for user to confirm again
                          }catch(e:any){
                            console.error('re-intent failed', e);
                            setShowPublishModal(false);
                          }
                          return;
                        }
                        if (code === 'invalid_token' || code === 'unauthorized' || code === 'content_mismatch'){
                          // show a helpful message (console for now) and close modal
                          console.error('Publish failed:', code);
                          setShowPublishModal(false);
                          return;
                        }
                        // Fallback: close modal
                        setShowPublishModal(false);
                      }
                    }}>{t('editor.confirmAndSave')}</Button>
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
                          onClick={async () => {
                            try{
                              if(!deletePage) return;
          const action = await dispatch(requestPublishIntentAction({ content: deletePage, purpose: 'delete-page' }));
          const res: any = (action as any).payload;
          const token = res?.token || (res?.raw && res.raw.headers && (res.raw.headers['x-selfreview-token'] || res.raw.headers['X-SelfReview-Token']));
          const message = (res?.hints && (res.hints.message?.es || res.hints.message?.en)) || (res?.raw && res.raw.headers && (res.raw.headers['x-selfreview-es'] || res.raw.headers['x-selfreview-en']));
                              setPublishToken(token || null);
                              setPublishMessage(message || null);
                              setPublishAction('delete');
                              setShowPublishModal(true);
                            }catch(err:any){
                              console.error('requestPublishIntent for delete failed', err);
                            } finally {
                              setShowConfirmDelete(false);
                            }
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

                {/* Warning info modal: explains why low-quality content matters */}
                <Modal show={showWarningInfo} onHide={() => setShowWarningInfo(false)} centered>
                  <Modal.Header closeButton className="modern-modal-header">
                    <Modal.Title className="modern-modal-title">Más información sobre contenido de baja calidad</Modal.Title>
                  </Modal.Header>

                
                  <Modal.Body className="modern-modal-body">
                    <div>
                      <p>La información de baja calidad (falsa, sesgada o manipulada) tiene efectos acumulativos: dificulta la toma de decisiones informada, reduce la confianza en fuentes fiables y puede amplificar comportamientos dañinos en redes sociales y sistemas automatizados.</p>
                      <p>Un modelo automatizado puede explicar con mayor detalle cómo señales de baja calidad (por ejemplo, fuentes no verificadas, afirmaciones sin evidencia, lenguaje sensacionalista) aumentan la probabilidad de difusión de desinformación y pueden inducir consecuencias sociales adversas.</p>
                      <p>Recomendaciones breves:</p>
                      <ul>
                        <li>Verifique las fuentes antes de publicar.</li>
                        <li>Evite afirmaciones sin evidencia clara.</li>
                        <li>Corrija sesgos o lenguaje sensacionalista.</li>
                      </ul>
                      <hr />
                      <p>Leer el artículo completo en Aurora Program:</p>
                      <p>
                        <a href="https://www.auroraprogram.org/article/Informational%20Sustainability:%20A%20Fundamental%20Principle%20for%20the%20Age%20of%20Electronic%20Intelligence" target="_blank" rel="noopener noreferrer">
                          Informational Sustainability — Aurora Program (leer artículo)
                        </a>
                      </p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="modern-modal-footer">
                    <Button variant="primary" onClick={() => setShowWarningInfo(false)}>Cerrar</Button>
                  </Modal.Footer>
                </Modal>

                {/* Save confirmation modal: shows warning and requires explicit confirm */}
        <Modal show={showSaveConfirm} onHide={() => setShowSaveConfirm(false)} centered>
                  <Modal.Header closeButton className="modern-modal-header">
          <Modal.Title className="modern-modal-title">{t('editor.saveChanges')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modern-modal-body">
                      <div>
                        <p><strong>{t('editor.warningTitle')}</strong> {t('editor.warningBody')}</p>
                        <p className="text-muted">{t('editor.confirmSaveQuestion')}</p>
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="modern-modal-footer">
                      <div className="modal-footer-content">
                        <div className="footer-actions w-100 justify-content-end">
                          <Button variant="outline-secondary" onClick={() => setShowSaveConfirm(false)} className="modern-btn-outline me-2">{t('editor.cancel')}</Button>
                          <Button variant="primary" className="modern-btn" onClick={async () => {
                            // Confirm and publish using the previously acquired token
                            try{
                              if (!publishToken){
                                throw new Error('Missing publish token');
                              }
                              const method = (editMode === 'editing' ? 'PUT' : 'POST');
                              await dispatch(publishPageWithTokenAction({ content: selectedPage, token: publishToken, method }));
                              setShowSaveConfirm(false);
                              setShowContent(false);
                              setPublishAction('none');
                              await dispatch(loadPages());
                            }catch(err:any){
                              console.error('publish from save-confirm failed', err);
                              setShowSaveConfirm(false);
                            }
                          }}>
                            {t('editor.confirmAndSave')}
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