import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set } from 'firebase/database'

const firebaseConfig = { projectId: 'thumbsapp-748bd' } // TODO: tighten access

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const getMediaList = async () => {
    const snapshot = await get(ref(db, 'requests'))
    return snapshot.val()
}

export const updateMediaList = async (newMediaList) => {
    await set(ref(db, 'requests'), newMediaList)
}
