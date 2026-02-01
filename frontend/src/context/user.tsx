import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usersApi } from "../server";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

interface User {
  guid: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  username: string;
  gender: number;
  birthday: string;
  region: string;
  district: string;
  about: string;
  biography: string;
  pfp: string;
  purposes: string;
}
interface LoginParams {
  phone: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

interface UserContextType extends User {
  user: User;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

const initialUser: User = {
  guid: "",
  role: "",
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  email: "",
  username: "",
  gender: 0,
  birthday: "",
  region: "",
  district: "",
  about: "",
  biography: "",
  pfp: "",
  purposes: "",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (): Promise<void> => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!accessToken) throw new Error("No access token");

      const { data } = await axios.get(
        `${usersApi}accounts/00000000-0000-0000-0000-000000000000/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setUser({
        guid: data.guid,
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        middleName: data.middle_name,
        phone: data.phone,
        email: data.email,
        username: data.username,
        gender: data.gender,
        birthday: data.birthday,
        region: data.region,
        district: data.district,
        about: data.about,
        biography: data.biography,
        pfp: data.pfp,
        purposes: data.purposes,
      });

      setIsAuthenticated(true);
    } catch (err) {
      console.error("User fetch failed:", err);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const login = async ({
    phone,
    password,
  }: LoginParams): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${usersApi}accounts/login/`, {
        phone,
        password,
      });

      if (data.access && data.refresh) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        await fetchUser();
        return { success: true };
      }

      return { success: false, error: "Noma'lum xatolik yuz berdi." };
    } catch (err: any) {
      clearSession();

      if (err.response && err.response.data && err.response.data.error) {
        return {
          success: false,
          error: err.response.data.error,
        };
      }

      return {
        success: false,
        error: "Tizimda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    clearSession();
    toast.info("Tizimdan chiqdingiz", {
      description: (
        <span className="text-black/40">
          Hisobingizdan muvaffaqiyatli chiqdingiz.
        </span>
      ),
    });
  };

  const clearSession = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    setUser(initialUser);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...user,
        user,
        isAuthenticated,
        login,
        logout,
        fetchUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
