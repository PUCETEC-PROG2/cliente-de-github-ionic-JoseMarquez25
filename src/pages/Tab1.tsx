import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <RepoItem name="Repositorio 1" imageUrl="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
          <RepoItem name="Repositorio 2" imageUrl="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
          <RepoItem name="Repositorio 3" imageUrl="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
