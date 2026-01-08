import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { IonList } from "@ionic/react";
import "./Tab1.css";
import RepoItem from "../components/RepoItem";
import React from "react";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { fetchRepositories } from "../services/GithubService";

const Tab1: React.FC = () => {
  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const reposData = await fetchRepositories();
      if (reposData.length === 0) {
        setError(
          "No se encontraron repositorios. Verifica tu token de GitHub en .env"
        );
      } else {
        setRepos(reposData);
      }
    } catch (err) {
      setError("Error al cargar los repositorios. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    console.log("******* Leyendo repositorios ... *******");
    loadRepos();
  });

  const handleRefresh = (event: CustomEvent) => {
    loadRepos().then(() => {
      (event.target as any).complete();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <IonSpinner name="circular"></IonSpinner>
            <p>Cargando repositorios...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "20px",
              margin: "20px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              color: "#721c24",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && repos.length === 0 && !error && (
          <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
            <p>No hay repositorios para mostrar</p>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <IonList>
            {repos.map((repo, index) => (
              <RepoItem
                key={index}
                name={repo.name}
                description={repo.description}
                imageUrl={repo.imageUrl}
                owner={repo.owner}
                language={repo.language}
                onRefresh={loadRepos}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;