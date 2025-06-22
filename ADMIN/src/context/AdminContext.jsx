import { createContext, useState } from "react";

export const Admincontext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const value = {
    aToken,
    setAToken,
    backendUrl,
  };

  return (
    <Admincontext.Provider value={value}>
      {props.children}
    </Admincontext.Provider>
  );
};
export default AdminContextProvider;
