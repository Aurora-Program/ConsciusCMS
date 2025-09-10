import axios from "axios";
import { iSchemaField, iSchemaPage } from "../types";


const url_bucket = (import.meta.env.VITE_URL_API_BUCKET || '') + "/" + (import.meta.env.VITE_CONTENT_BUCKET_NAME || '')

// (old iSchemaPageTable removed - not used)

export  const downloadFile = async (name: string) =>
    {
        const res = await fetch(url_bucket + "/"  + name, {
            method: 'GET',
            // 👇 Set headers manually for single file upload
            headers: {
              'content-type': 'image/png'
            },
          })
            const imageBlob = await res.blob()
            const imageObjectURL =  URL.createObjectURL(imageBlob);
            console.log("download file:" + imageObjectURL)
            return (imageObjectURL)
    }

export const uploadImage = async (file: File)=> {

    console.log("file name:" + file.name)
        // 👇 Uploading the file using the fetch API to the server
    try{
    const res = await fetch(url_bucket + "/" + file.name, {
          method: 'PUT',
          body: file,
          // 👇 Set headers manually for single file upload
          headers: {
            'content-type': file.type,
            'content-length': `${file.size}`, // 👈 Headers need to be a string
             Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
          },
        })
    
    const  data = ""

    


    }
    catch{
        console.log("error")
        }

    }





export async function addPage(data: any){

    const url = import.meta.env.VITE_URL_API_PAGES


    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
        },  
        }

    const res = await axios.post( url,data,config );

    return {Page: res['data'].Page, Template: res['data'].Template, values:[]}

    }

    export async function savePage(data: any){

        const url = import.meta.env.VITE_URL_API_PAGES
    
    
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`
            },  
            }
    
        const res = await axios.post( url,data,config );

        console.log("data:" + data.values[0])
    
        return {res}
    
        }


    
export async function deletePage(data: any){

    const url = import.meta.env.VITE_URL_API_PAGES

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
        },                   
        data
    };

    const res = await axios.delete( url, config );
    console.log("item: " + data.component)
    const response : iSchemaField[] = data
    return response

    }




export async function fetchPageByPage(payload: string){
    console.log("payload:"+payload)
    const url = import.meta.env.VITE_URL_API_PAGES + "/" + payload
    // const pageBucket = import.meta.env.VITE_CONTENT_BUCKET_URL // (unused, removed)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           
        }
    };
    const res = await axios.get( url );


    console.log ("r: " + res['data'].Items)
    const response : any = res['data'].Items[0]

    const r = {selectedPage: response, data: response?.values}

     return r

    }



    

    export async function fetchPages(filter?: string | RegExp){

        const url = import.meta.env.VITE_URL_API_PAGES
        const debugFlag = import.meta.env.VITE_ENV_DEBUG === 'true'
        if (debugFlag) {
            console.log("=== FETCH PAGES DEBUG START ===")
            console.log("VITE_URL_API_PAGES:", url)
            console.log("ALL env keys:", Object.keys(import.meta.env).filter(k=>k.startsWith('VITE_')))
        }

        if (!url) {
            console.error('[fetchPages] VITE_URL_API_PAGES no está definido. Crea .env.local o .env con la variable. Abortando fetch.')
            return []
        }
    
    const token = sessionStorage.getItem('accessToken')
    const baseHeaders: Record<string,string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) baseHeaders['Authorization'] = `Bearer ${token}` // probar con auth desde el inicio

    const config = { headers: baseHeaders } as const
    
    try {
        let res = await axios.get( url, config );
        if (debugFlag) {
            console.log("API Response Status:", res.status);
            console.log("API Response Data shape keys:", Object.keys(res['data'] || {}))
        }

        // helper to normalize a list of items into our payload shape
        const normalizeItems = (items: any[]): any[] => {
            return items.map((item: any) => {
                // Accept multiple possible field names
                const pageName = item.Page || item.page || item.pageId || item.id || item.Name
                const template = item.CType || item.Template || item.Type || item.template || 'Unknown'
                return { Page: pageName, Template: template }
            }).filter(p => p.Page)
        }

        let payload: any[] = []

        // Common shape: res.data.Items is an array
        if (res['data']?.Items && Array.isArray(res['data'].Items)) {
            console.log('Found res.data.Items array, normalizing...')
            payload = normalizeItems(res['data'].Items as any[])
        } else if (Array.isArray(res['data'])) {
            console.log('Found res.data as array, normalizing...')
            payload = normalizeItems(res['data'] as any[])
        } else if (res['data'] && typeof res['data'] === 'object') {
            // Try common nested shapes
            const maybeItems = res['data'].items || res['data'].data || res['data'].results
            if (Array.isArray(maybeItems)) {
                console.log('Found nested items in res.data, normalizing...')
                payload = normalizeItems(maybeItems)
            } else {
                console.log('Unknown response shape, attempting to coerce object -> array by keys')
                try {
                    const vals = Object.values(res['data'])
                    const arrays = vals.filter(v => Array.isArray(v) && v.length > 0)
                    if (arrays.length > 0) {
                        payload = normalizeItems(arrays[0] as any[])
                    }
                } catch (e) {
                    // ignore
                }
            }
        }

        // If we got nothing and server returned 401 or 403, try again with Authorization if token exists
        if ((payload.length === 0) && (res.status === 401 || res.status === 403)) {
            const token = sessionStorage.getItem('accessToken')
            if (token) {
                console.log('Retrying fetchPages with Authorization header')
                const authConfig = { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } }
                try {
                    res = await axios.get(url, authConfig)
                    if (res['data']?.Items && Array.isArray(res['data'].Items)) payload = normalizeItems(res['data'].Items)
                } catch (e) {
                    console.warn('Auth retry failed', e)
                }
            }
        }

    if (debugFlag) console.log('Final payload length (pre-filter):', payload.length)

        // If caller provided a filter, apply a best-effort client-side filter
        if (filter) {
            if (debugFlag) console.log('Applying client-side filter to pages:', filter)
            const test = typeof filter === 'string'
                ? (v: string) => String(v || '').toLowerCase().includes(filter.toLowerCase())
                : (v: string) => {
                    let rx = filter as RegExp
                    try { if (!rx.flags.includes('i')) rx = new RegExp(rx.source, rx.flags + 'i') } catch {}
                    return rx.test(String(v || ''))
                  }
            payload = payload.filter((p: any) => {
                const candidate = String(p.Template || p.template || p.Type || p.Page || p.page || p.Title || p.Name || '')
                return test(candidate)
            })
            if (debugFlag) console.log('Filtered payload length:', payload.length)
        }

    if (debugFlag) console.log('=== FETCH PAGES DEBUG END ===')
        return payload

    } catch (error) {
    console.error("[fetchPages] Error:", error);
    console.log("=== FETCH PAGES ERROR ===");
        return [];
    }
}

    
    export async function editPage(data: any){

        const url = import.meta.env.VITE_URL_API_PAGES
    
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
            },  
            }
    
        const res = await axios.post( url,data,config );
        return res['data']
    
        }