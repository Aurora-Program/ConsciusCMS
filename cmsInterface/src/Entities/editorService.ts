import axios from "axios";
import { iSchemaField, iPage } from "../types";
import { checkAccessTokenExpiration } from "../users/authService";

const url_bucket = import.meta.env.VITE_URL_API_BUCKET + "/" + import.meta.env.VITE_CONTENT_BUCKET_NAME;

// Download a file from the content bucket (public GET)
export const downloadFile = async (name: string) => {
  const res = await fetch(url_bucket + "/" + name, {
    method: "GET",
    headers: {
      "content-type": "image/png",
    },
  });
  const imageBlob = await res.blob();
  return URL.createObjectURL(imageBlob);
};

// Upload an image to the content bucket (authorized PUT)
export const uploadImage = async (file: File, uniquename: string) => {
  await checkAccessTokenExpiration();
  try {
    await fetch(url_bucket + "/" + uniquename, {
      method: "PUT",
      body: file,
      headers: {
        "content-type": file.type,
        "content-length": `${file.size}`,
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
  } catch (e) {
    console.error("uploadImage error", e);
  }
};

// ---------- Ethics token helpers ----------
function getEthicsTokenUrl(): string {
  const pagesUrl: string = import.meta.env.VITE_URL_API_PAGES;
  const explicit = (import.meta.env as any).VITE_URL_API_ETHICS as string | undefined;
  if (explicit && explicit.length > 0) return explicit;
  try {
    const u = new URL(pagesUrl);
    const trimmed = u.pathname.endsWith("/pages")
      ? u.pathname.slice(0, -"/pages".length)
      : u.pathname;
    u.pathname = `${trimmed.replace(/\/$/, "")}/ethics/token`;
    return u.toString();
  } catch {
    return (pagesUrl || "").replace(/\/pages$/, "") + "/ethics/token";
  }
}

async function getEthicsToken(purpose: string, page?: string): Promise<string> {
  await checkAccessTokenExpiration();
  const tokenUrl = getEthicsTokenUrl();
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  };
  const body: any = { purpose };
  if (page) body.page = page;
  const res = await axios.post(tokenUrl, body, config);
  // Expect { token: "..." } but support simple string
  const tok =
    (res?.data && (res.data.token || res.data.Token)) ||
    (typeof res?.data === "string" ? res.data : "");
  if (!tok) throw new Error("No ethics token returned by API");
  return tok as string;
}

// ---------- Pages API ----------
export async function addPage(data: any) {
  const url = import.meta.env.VITE_URL_API_PAGES;
  await checkAccessTokenExpiration();
  const ethics = await getEthicsToken("create-page", data?.Page);
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "ethics-token": ethics,
    },
  };
  const res = await axios.post(url, data, config);
  return { Page: res.data.Page, Template: res.data.Template, values: [] } as iPage;
}

export async function savePage(data: any) {
  const url = import.meta.env.VITE_URL_API_PAGES;
  await checkAccessTokenExpiration();
  const ethics = await getEthicsToken("save-page", data?.Page);
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "ethics-token": ethics,
    },
  };
  const res = await axios.post(url, data, config);
  return { res };
}

export async function updatePage(data: any) {
  const url = import.meta.env.VITE_URL_API_PAGES;
  await checkAccessTokenExpiration();
  const ethics = await getEthicsToken("update-page", data?.Page);
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "ethics-token": ethics,
    },
  };
  const res = await axios.put(url, data, config);
  return { res };
}

export async function deletePage(data: any) {
  const url = import.meta.env.VITE_URL_API_PAGES;
  await checkAccessTokenExpiration();
  const ethics = await getEthicsToken("delete-page", data?.Page);
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "ethics-token": ethics,
    },
    data,
  } as any;
  await axios.delete(url, config);
  return data as iSchemaField;
}

export async function fetchPageByPage(payload: string) {
  await checkAccessTokenExpiration();
  const url = import.meta.env.VITE_URL_API_PAGES + "/" + payload;
  const res = await axios.get(url);
  return res.data.Items[0];
}

export async function fetchPages() {
  const url = import.meta.env.VITE_URL_API_PAGES;
  await checkAccessTokenExpiration();
  const res = await axios.get(url);
  const items = (res.data?.Items || []) as Array<{
    Page: string;
    Template: string;
    updateTime?: string;
    updateUser?: string;
  }>;

  const payload: iPage[] = [];
  items.forEach((item) =>
    payload.push({ Page: item.Page, Template: item.Template, values: [], updateTime: item.updateTime, updateUser: item.updateUser })
  );
  return payload;
}

export async function editPage(data: iSchemaField) {
  const url = import.meta.env.VITE_URL_API_PAGES;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  };
  const res = await axios.post(url, data, config);
  return res.data;
}