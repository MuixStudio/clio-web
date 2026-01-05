"use client";

import type { FC, ReactNode } from "react";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  createContext,
  useContext,
  useContextSelector,
} from "use-context-selector";
import { noop } from "lodash-es";

import { listTenants, TenantRsp, TenantsRsp } from "@/services/tenant";
import { getUserInfo, UserInfoRsp } from "@/services/user";

export type AppContextValue = {
  userInfo: UserInfoRsp;
  tenants: TenantsRsp;
  currentTenant: TenantRsp;
  mutateUserInfo: VoidFunction;
  mutateTenants: VoidFunction;
  // mutateCurrentTenant: VoidFunction;
  useSelector: typeof useSelector;
  isLoadingUserInfo: boolean;
  isLoadingTenants: boolean;
  // isLoadingCurrentTenant: boolean;
};

const userInfoPlaceholder: UserInfoRsp = {
  user_id: "",
  name: "",
  email: "",
  avatar_url: "",
};

// const initialVersionInfo = {
//   current_env: "",
//   current_version: "",
//   latest_version: "",
//   release_date: "",
//   release_notes: "",
//   version: "",
//   can_auto_update: false,
// };

const initialTenant: TenantRsp = {
  tenant_id: "",
  name: "",
  plan_type: "",
  status: "",
  identity: "ordinary",
};

const initialTenants: TenantsRsp = [];

const AppContext = createContext<AppContextValue>({
  userInfo: userInfoPlaceholder,
  tenants: [],
  currentTenant: initialTenant,
  mutateUserInfo: noop,
  mutateTenants: noop,
  // mutateCurrentTenant: noop,
  useSelector: useSelector,
  isLoadingUserInfo: false,
  isLoadingTenants: false,
  // isLoadingCurrentTenant: false,
});

export function useSelector<T>(selector: (value: AppContextValue) => T): T {
  return useContextSelector(AppContext, selector);
}

export type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}) => {
  const {
    data: userInfoRsp,
    mutate: mutateUserInfo,
    error: userInfoError,
    isLoading: isLoadingUserInfo,
  } = useSWR({ url: "/api/v1/userinfo", params: {} }, getUserInfo);

  const {
    data: tenantsRsp,
    mutate: mutateTenantsRsp,
    isLoading: isLoadingTenants,
  } = useSWR({ url: "/api/v1/tenants", params: {} }, listTenants);

  // const {
  //   data: tenantRsp,
  //   mutate: mutateCurrentTenantRsp,
  //   isLoading: isLoadingTenant,
  // } = useSWR({ url: "/api/v1/current/tenant", params: {} }, getCurrentTenant);

  const [userInfo, setUserInfo] = useState<UserInfoRsp>(userInfoPlaceholder);

  const [tenants, setTenants] = useState<TenantsRsp>(initialTenants);
  const [currentTenant, setCurrentTenant] = useState<TenantRsp>(initialTenant);

  useEffect(() => {
    if (userInfoRsp) setUserInfo(userInfoRsp);
  }, [userInfoRsp]);

  useEffect(() => {
    if (tenantsRsp) setTenants(tenantsRsp);
  }, [tenantsRsp]);

  useEffect(() => {
    if (tenantsRsp) setCurrentTenant(tenantsRsp[0]);
  }, [tenantsRsp]);

  return (
    <AppContext.Provider
      value={{
        userInfo: userInfo,
        tenants: tenants,
        currentTenant: currentTenant,
        mutateUserInfo: mutateUserInfo,
        mutateTenants: mutateTenantsRsp,
        // mutateCurrentTenant: mutateCurrentTenantRsp,
        useSelector,
        isLoadingUserInfo: isLoadingUserInfo,
        isLoadingTenants: isLoadingTenants,
        // isLoadingCurrentTenant: isLoadingTenant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
