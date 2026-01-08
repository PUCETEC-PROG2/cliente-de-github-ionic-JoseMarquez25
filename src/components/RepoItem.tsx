import "./RepoItem.css";
import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonIcon,
  IonAlert,
  IonToast,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButtons,
} from "@ionic/react";
import { trash, create, close } from "ionicons/icons";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { deleteRepository, updateRepository } from "../services/GithubService";

interface Props extends RepositoryItem {
  onRefresh: () => void;
}

const normalize = (value?: string | null) => value?.trim() || "";

const RepoItem: React.FC<Props> = ({
  name,
  description,
  imageUrl,
  owner,
  language,
  onRefresh,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [originalName, setOriginalName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");

  useEffect(() => {
    if (showEditModal) {
      setEditName(name);
      setEditDescription(description ?? "");
      setOriginalName(name);
      setOriginalDescription(description ?? "");
    }
  }, [showEditModal, name, description]);


  const handleDelete = async () => {
    if (!owner) {
      setToast("❌ No se pudo obtener el propietario");
      return;
    }

    setIsLoading(true);
    try {
      await deleteRepository(owner, name);
      setToast("✅ Repositorio eliminado");
      setShowDelete(false);
      setTimeout(onRefresh, 800);
    } catch (error) {
      setToast("❌ Error al eliminar repositorio");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!owner) {
      setToast("❌ No se pudo obtener el propietario");
      return;
    }

    const newName = editName.trim();
    const newDescription = editDescription ?? "";

    if (!newName) {
      setToast("❌ El nombre no puede estar vacío");
      return;
    }

    const nameChanged = newName !== originalName;
    const descriptionChanged = newDescription !== originalDescription;

    if (!nameChanged && !descriptionChanged) {
      setToast("ℹ️ No hay cambios que guardar");
      return;
    }

    const payload: { name?: string; description?: string } = {};

    if (nameChanged) payload.name = newName;
    if (descriptionChanged) payload.description = newDescription;

    setIsLoading(true);

    try {
      await updateRepository(owner, originalName, payload);

      setToast("✅ Repositorio actualizado correctamente");
      setShowEditModal(false);
      setTimeout(onRefresh, 1000);
    } catch (error) {
      console.error(error);
      setToast("❌ Error al actualizar repositorio");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <IonItem>
        <IonThumbnail slot="start">
          <img
            alt="Repo avatar"
            src={
              imageUrl ||
              "https://ionicframework.com/docs/img/demos/thumbnail.svg"
            }
          />
        </IonThumbnail>

        <IonLabel>
          <h2>{name}</h2>
          <p>{description}</p>
          <p>Propietario: {owner}</p>
          <p>Lenguaje: {language}</p>

          <IonButton size="small" fill="outline" onClick={() => setShowEditModal(true)}>
            <IonIcon icon={create} slot="start" />
            Editar
          </IonButton>

          <IonButton
            size="small"
            color="danger"
            fill="outline"
            onClick={() => setShowDelete(true)}
          >
            <IonIcon icon={trash} slot="start" />
            Eliminar
          </IonButton>
        </IonLabel>
      </IonItem>

      {/* MODAL */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Editar Repositorio</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonInput
            fill="outline"
            label="Nombre"
            value={editName}
            onIonChange={(e) => setEditName(e.detail.value ?? "")}
          />

          <IonTextarea
            fill="outline"
            label="Descripción"
            value={editDescription}
            onIonChange={(e) => setEditDescription(e.detail.value ?? "")}
            rows={6}
          />

          <IonButton expand="block" onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </IonButton>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showDelete}
        header="Confirmar"
        message="¿Eliminar este repositorio?"
        buttons={[
          { text: "Cancelar", role: "cancel" },
          { text: "Eliminar", handler: handleDelete },
        ]}
        onDidDismiss={() => setShowDelete(false)}
      />

      <IonToast
        isOpen={!!toast}
        message={toast}
        duration={2000}
        onDidDismiss={() => setToast("")}
      />
    </>
  );
};

export default RepoItem;
