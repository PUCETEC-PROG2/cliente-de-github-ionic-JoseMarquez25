import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

// Validar que las variables de entorno estén configuradas
if (!GITHUB_API_URL || !GITHUB_API_TOKEN) {
  console.error(
    "❌ Error: Variables de entorno no configuradas. Copia .env.example a .env y configura tus credenciales de GitHub."
  );
}

const api = axios.create({
  baseURL: GITHUB_API_URL || "https://api.github.com",
  headers: {
    Authorization: `Bearer ${GITHUB_API_TOKEN || ""}`,
    Accept: "application/vnd.github+json",
  },
});

/* =========================
   GET REPOS (YA EXISTENTE)
========================= */
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  try {
    if (!GITHUB_API_TOKEN) {
      throw new Error(
        "Token de GitHub no configurado. Por favor, configura VITE_GITHUB_API_TOKEN en .env"
      );
    }

    const response = await api.get("/user/repos", {
      params: { per_page: 100, sort: "created", direction: "desc" },
    });

    if (!response.data || response.data.length === 0) {
      console.warn("⚠️ No se encontraron repositorios");
      return [];
    }

    return response.data.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner?.login ?? "Unknown",
      description: repo.description ?? "Sin descripción",
      imageUrl: repo.owner?.avatar_url ?? null,
      language: repo.language ?? "Sin especificar",
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error de API:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        docs: error.response?.data?.documentation_url,
      });
    } else {
      console.error("❌ Error al cargar repositorios:", error);
    }
    return [];
  }
};

/* =========================
   CREATE REPO (YA EXISTENTE)
========================= */
export const createRepository = async (
  name: string,
  description: string
): Promise<void> => {
  await api.post("/user/repos", {
    name,
    description,
    private: false,
  });
};

/* =========================
   DELETE REPO (NUEVO)
========================= */
export const deleteRepository = async (
  owner: string,
  repoName: string
): Promise<void> => {
  try {
    if (!owner || !repoName) {
      throw new Error("Owner o nombre de repositorio inválidos");
    }
    const response = await api.delete(`/repos/${owner}/${repoName}`);
    console.log(`✅ Repositorio ${repoName} eliminado exitosamente`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error al eliminar repositorio:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw new Error(
        error.response?.data?.message || "No se pudo eliminar el repositorio"
      );
    } else {
      console.error("❌ Error al eliminar repositorio:", error);
      throw error;
    }
  }
};

/* =========================
   UPDATE REPO (PUT / PATCH)
========================= */
export const updateRepository = async (
  owner: string,
  repoName: string,
  data: { name?: string; description?: string }
): Promise<void> => {
  try {
    if (!owner || !repoName) {
      throw new Error("Owner o nombre de repositorio inválidos");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No hay datos para actualizar");
    }
    const response = await api.patch(`/repos/${owner}/${repoName}`, data);
    console.log(`✅ Repositorio ${repoName} actualizado exitosamente`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error al actualizar repositorio:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw new Error(
        error.response?.data?.message || "No se pudo actualizar el repositorio"
      );
    } else {
      console.error("❌ Error al actualizar repositorio:", error);
      throw error;
    }
  }
};

/* =========================
   USER INFO (YA EXISTENTE)
========================= */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error recuperando usuario", error);
    return null;
  }
};
