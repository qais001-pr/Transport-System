export const userQueryKeys = {
  me: ["me"],
  profile: () => [...userQueryKeys.me, "profile"],
  editProfile: (userId) => [...userQueryKeys.profile(), "edit", userId],
};