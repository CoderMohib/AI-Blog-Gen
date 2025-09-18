import { useContext } from "react";
import {AuthContext} from "../utils/context/AuthContect";

export const useAuth = () => useContext(AuthContext);
