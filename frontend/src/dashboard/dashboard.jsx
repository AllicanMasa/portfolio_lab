import React from 'react'

const dashboard = () => {
  return (
    <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>
        Logout
      </button>
  )
}

export default dashboard