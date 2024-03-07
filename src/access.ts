
export default function access(initialState: InitialState| undefined) {
  const { loginUser } = initialState ?? {};
  return {
    canAdmin: loginUser && loginUser?.userRole === 'admin',
    canUser:loginUser
  };
}
