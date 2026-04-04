// TODO: Move these methods to the backend API

const AUTH_FIREBASE_USERS = async(path = '') => {
    const authToken = await fetch(process.env.REACT_APP_AUTH_URL).then(res => res.json())
    return `https://thumbsapp-748bd-default-rtdb.firebaseio.com/${path}.json?access_token=${authToken}`
}

export const createUser = async({ username, password }) => fetch(await AUTH_FIREBASE_USERS(), { method: 'PATCH', body: JSON.stringify({[username]: { password: password }}) })
export const getUser = async(user) => fetch(await AUTH_FIREBASE_USERS(user)).then(res => res.json())

export const getMediaList = async() => fetch(await AUTH_FIREBASE_USERS(`requests`)).then(res => res.json())
export const updateMediaList = async(newMediaList) => fetch(await AUTH_FIREBASE_USERS(`requests`), { method: 'PUT', body: JSON.stringify(newMediaList)})