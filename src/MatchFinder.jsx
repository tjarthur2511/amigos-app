import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function MatchFinder() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const fetchMatches = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMatches(users.slice(0, 5))
    }
    fetchMatches()
  }, [])

  return (
    <div>
      <h3>Suggested Amigos</h3>
      <ul>
        {matches.map(user => (
          <li key={user.id}>{user.name} - {user.hobby}</li>
        ))}
      </ul>
    </div>
  )
}

export default MatchFinder
