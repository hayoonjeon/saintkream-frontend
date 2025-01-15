import { create } from "zustand"; // 중괄호를 사용해야 합니다!

const useAccountStore = create((set) => ({
  defaultAccount: null, // 기본 정산 계좌 상태
  accounts: [], // 모든 계좌 상태

  // 기본 계좌 설정 함수
  setDefaultAccount: (account) =>
    set((state) => ({
      defaultAccount: account,
      accounts: state.accounts.map((item) =>
        item.id === account.id
          ? { ...item, isDefault: 1 }
          : { ...item, isDefault: 0 }
      ),
    })),

  // 계좌 목록 설정 함수
  setAccounts: (accounts) =>
    set({
      accounts: accounts.sort((a, b) => b.isDefault - a.isDefault),
      defaultAccount: accounts.find((account) => account.isDefault === 1) || null,
    }),
}));

export default useAccountStore;