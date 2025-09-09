import axios from "axios";
import { iSchemaField, iPage } from "../types";
import { checkAccessTokenExpiration } from "../users/authService";


const url_bucket = import.meta.env.VITE_URL_API_BUCKET + "/" + import.meta.env.VITE_CONTENT_BUCKET_NAME

type PagesListItem = {
    Page: string;
    Template: string;
    updateTime?: string;
    updateUser?: string;
};


export const downloadFile = async (name: string) => {
    const res = await fetch(url_bucket + "/" + name, {
        method: "GET",
        headers: { "content-type": "image/png" },
    });
    const imageBlob = await res.blob();
    return URL.createObjectURL(imageBlob);
}

export const uploadImage = async (file: File, uniquename: string)=> {

    checkAccessTokenExpiration();

        try{
        await fetch(url_bucket + "/" + uniquename, {
          method: 'PUT',
          body: file,
          // 👇 Set headers manually for single file upload
          headers: {
            'content-type': file.type,
            'content-length': `${file.size}`, // 👈 Headers need to be a string
             Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
          },
        })
        } catch(e){
                console.error("uploadImage error", e)
        }

}

// ---------- Ethics token helpers ----------
function getEthicsTokenUrl(): string {
    const pagesUrl: string = import.meta.env.VITE_URL_API_PAGES;
    const explicit = (import.meta.env as any).VITE_URL_API_ETHICS as string | undefined;
    if (explicit && explicit.length > 0) return explicit;
    try {
        const u = new URL(pagesUrl);
        const trimmed = u.pathname.endsWith('/pages') ? u.pathname.slice(0, -('/pages'.length)) : u.pathname;
        u.pathname = `${trimmed.replace(/\/$/, '')}/ethics/token`;
        return u.toString();
    } catch {
        return (pagesUrl || '').replace(/\/pages$/, '') + '/ethics/token';
    }
}

async function getEthicsToken(purpose: string, page?: string): Promise<string> {
    await checkAccessTokenExpiration();
    const tokenUrl = getEthicsTokenUrl();
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    };
    const body: any = { purpose };
    if (page) body.page = page;
    const res = await axios.post(tokenUrl, body, config);
    const tok = (res?.data && (res.data.token || res.data.Token)) || (typeof res?.data === 'string' ? res.data : '');
    if (!tok) throw new Error('No ethics token returned by API');
    return tok as string;
}





export async function addPage(data: any){

    const url = import.meta.env.VITE_URL_API_PAGES
    checkAccessTokenExpiration();

    const ethics = await getEthicsToken('create-page', data?.Page);

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`,
            'ethics-token': ethics,
        },  
        }

    try{
        const res = await axios.post( url,data,config );
        return {Page: res['data'].Page, Template: res['data'].Template, values:[]} as iPage
    }catch(err:any){
        console.error('addPage error', err && err.response ? err.response.data : err);
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`addPage failed: ${msg}`);
    }

    }


    export async function savePage(data: any){

        const url = import.meta.env.VITE_URL_API_PAGES

        const ethics = await getEthicsToken('save-page', data?.Page);

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`,
                'ethics-token': ethics,
            },  
            }
    
        try{
            const res = await axios.post( url,data,config );
            return {res}
        }catch(err:any){
            console.error('savePage error', err && err.response ? err.response.data : err);
            const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
            throw new Error(`savePage failed: ${msg}`);
        }
    
        }

    export async function updatePage(data: any){

            const url = import.meta.env.VITE_URL_API_PAGES
            checkAccessTokenExpiration();
        const ethics = await getEthicsToken('update-page', data?.Page);

        const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
            "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`,
            'ethics-token': ethics,
                },  
                }
        
            try{
                const res = await axios.put( url,data,config );
                return {res}
            }catch(err:any){
                console.error('updatePage error', err && err.response ? err.response.data : err);
                const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
                throw new Error(`updatePage failed: ${msg}`);
            }
        
            }
    
export async function deletePage(data: iSchemaField){

    const url = import.meta.env.VITE_URL_API_PAGES
    checkAccessTokenExpiration();

    const ethics = await getEthicsToken('delete-page', (data as any)?.Page);

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`,
            'ethics-token': ethics,
        },                   
        data
    };

    await axios.delete( url, config );
    return data

    }




export async function fetchPageByPage(payload: string){
    console.log("payload:"+payload)
    const url = import.meta.env.VITE_URL_API_PAGES + "/" + payload

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           
        }
    };
    try{
        const res = await axios.get( url );
        console.log ("r: " + res['data'].Items)
    const response : any = res['data'].Items[0]
        return response
    }catch(err:any){
        console.error('fetchPageByPage error', err && err.response ? err.response.data : err);
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`fetchPageByPage failed: ${msg}`);
    }

    }



    

    export async function fetchPages(){

    const url = import.meta.env.VITE_URL_API_PAGES
    checkAccessTokenExpiration();

    console.log("url: "+ url)
    
    try{
        const res = await axios.get( url, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } } );
        console.log (res['data'])
        
    const payload = [] as iPage[]
    (res['data'].Items as PagesListItem[]).forEach((item: PagesListItem) => {
        payload.push({Page: item.Page, Template: item.Template, values: [], updateTime:item.updateTime, updateUser: item.updateUser})
    })
        return payload
    }catch(err:any){
        console.error('fetchPages error', err && err.response ? err.response.data : err);
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`fetchPages failed: ${msg}`);
    }
    }

    export async function editPage(data: iSchemaField){

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

/**
 * Request a short-lived publish-intent token from the API.
 * The API expected URL is the same API root where /pages lives, with path /publish-intent.
 * It returns a token and a short message to show to the user.
 */
export async function requestPublishIntent(content:any, purpose: 'save-page'|'update-page'|'delete-page' = 'save-page'){
    // Call explicit ethics token endpoint
    const ethicsUrl = getEthicsTokenUrl();
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("accessToken") || ''}`
        }
    };
    try{
    const payloadPage = (content && content.Page) ? content.Page : content;
    const res = await axios.post(ethicsUrl, { purpose, page: payloadPage }, config);
        const token = (res.data && (res.data.token || res.data.Token)) || '';
        const hints = res.data && (res.data.hints || res.data.message) ? (res.data.hints || { message: res.data.message }) : undefined;
        const expiresAt = (res.data && res.data.expiresAt) || undefined;
        return { token, hints, expiresAt, raw: res };
    }catch(err:any){
        console.error('requestPublishIntent error', err && err.response ? err.response.data : err);
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`requestPublishIntent failed: ${msg}`);
    }
}

/**
 * Publish a page (POST/PUT) including the self-review token and decision.
 * The backend expects a payload { token, decision, content }.
 */
export async function publishPage(content:any, token:string, _decision:string){
    // Confirm save with ethics token by POSTing the content to /pages
    const url = import.meta.env.VITE_URL_API_PAGES;
    checkAccessTokenExpiration();
    const headers:any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`,
        'ethics-token': token
    };
    try{
        const config = { headers };
        const res = await axios.post(url, content, config);
        return res.data;
    }catch(err:any){
        console.error('publishPage error', err && err.response ? err.response.data : err);
        if (err && err.response && err.response.status){
            const status = err.response.status;
            if (status === 410) throw new Error('token_expired');
            if (status === 400) throw new Error('invalid_token');
            if (status === 401) throw new Error('unauthorized');
            if (status === 409) throw new Error('content_mismatch');
        }
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`publishPage failed: ${msg}`);
    }
}

/**
 * Publish a delete action using token/decision. Sends DELETE with body containing token/decision/content
 */
export async function publishDelete(content:any, token:string, _decision:string){
    const url = import.meta.env.VITE_URL_API_PAGES;
    checkAccessTokenExpiration();
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`,
            'ethics-token': token
        },
        // send page info in the body for delete
        data: content
    };
    try{
        const res = await axios.delete(url, config);
        return res.data;
    }catch(err:any){
        console.error('publishDelete error', err && err.response ? err.response.data : err);
        const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message || String(err);
        throw new Error(`publishDelete failed: ${msg}`);
    }
}