import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const USER_FIREBASE_COLLECTION = 'users';

export const getBaseCollectionRef = () =>
  firestore().collection(USER_FIREBASE_COLLECTION).doc(auth().currentUser?.uid);
